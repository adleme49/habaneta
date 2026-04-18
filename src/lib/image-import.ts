// Image-to-tile import pipeline.
//
// Takes a raster image (from a photo of a real tile) and converts it
// into an SVG with `colora stN` layers that the editor can recolor.
//
// Pipeline:
//   1. Render image to a canvas at TILE_PX × TILE_PX
//   2. Downsample to GRID × GRID cells (average color per cell)
//   3. Convert cells to OKLAB for perceptually-uniform clustering
//   4. K-means++ in OKLAB → N layers
//   5. 3×3 majority filter to smooth speckle at color boundaries
//   6. Emit SVG with horizontal run-merged <rect>s per layer

// ---- Constants ----

/** Tile canvas size in pixels. */
const TILE_PX = 400;

/** Grid resolution: number of cells per axis. 160 → 25,600 cells.
 *  Finer analysis than a rendering surface needs, but it matters at
 *  tile seams — when the imported tile repeats across a floor, seam
 *  quantization error equals CELL_PX. Half the cell size → half the
 *  visible mismatch. */
const GRID = 160;

/** Pixels per cell (float-safe — downsample reads integer bounds). */
const CELL_PX = TILE_PX / GRID;

/** Passes of 3×3 majority filter applied to the label grid post-cluster.
 *  At GRID=160 each pass smooths ~CELL_PX·2=5 px of wobble; 5 passes
 *  handles typical photo noise while keeping motifs intact. */
const MAJORITY_PASSES = 5;

/** Remove connected components smaller than this many cells. Scales
 *  as cell-count (area) — was 6 at GRID=80, so 6·(160/80)²=24 here. */
const MIN_COMPONENT_CELLS = 24;

// ---- Public API ----

export interface ImportResult {
  svgDataUrl: string;
  svgText: string;
  /** Detected layers: layer id → hex color. */
  layers: Record<string, string>;
  /** The quantized image as a grid of layer assignments (for debugging). */
  grid: number[][];
  /**
   * Minimum pairwise OKLAB distance among centroids. Small values
   * (~<0.04) mean two layers look very similar — a UI hint that the
   * user may want to reduce layerCount.
   */
  minCentroidDistance: number;
}

/**
 * Symmetry to assume when preprocessing. Enforcing symmetry averages
 * equivalent cells, which denoises photos dramatically since the same
 * motif repeats at multiple positions in a real tile.
 */
export type Symmetry = 'none' | '2fold' | '4fold';

export interface ImportOptions {
  /** Number of color clusters / layers. Default 5. */
  layerCount?: number;
  /** K-means iteration cap. Default 25. */
  maxIterations?: number;
  /** Symmetry to enforce on the input (default 'none'). */
  symmetry?: Symmetry;
  /** Trim uniform borders/grout from the image (default true). */
  autoCrop?: boolean;
  /** Luminance percentile stretch. Off by default — useful for dim photos,
   * but skipped automatically on limited-palette / high-contrast inputs. */
  autoLevels?: boolean;
}

/**
 * Process a raster image file into an SVG tile with recolorable layers.
 * Runs entirely on the client via canvas + k-means (OKLAB distance).
 */
export async function importImageAsTile(
  file: File,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const {
    layerCount = 5,
    maxIterations = 25,
    symmetry = 'none',
    autoCrop = true,
    autoLevels = false,
  } = options;

  const img = await loadImage(file);
  const pixels = rasterize(img, { autoCrop });
  if (autoLevels) applyAutoLevels(pixels);

  // Average pixel colors within each cell (sRGB 8-bit). The 5×5 box
  // implicit in downsample already smooths pixel-level JPEG noise; a
  // separate pre-blur is not worth the cost in color bleed at edges.
  let cellRgb = downsample(pixels);

  // Enforce symmetry by averaging cells that should look the same.
  if (symmetry !== 'none') cellRgb = enforceSymmetry(cellRgb, symmetry);

  // Convert to OKLAB for perceptual clustering.
  const cellLab: Vec3[] = cellRgb.map(rgbToOklab);

  // K-means in OKLAB space.
  const kmeansResult = kmeans(cellLab, layerCount, maxIterations);

  // Drop any cluster that has zero assignments — empty clusters would
  // otherwise produce bogus swatches and unused layer ids.
  const { assignments, centroids } = dropEmptyClusters(
    kmeansResult.assignments,
    kmeansResult.centroids
  );

  // Build grid of layer assignments.
  let grid: number[][] = toGrid(assignments);

  // Multi-pass 3×3 majority filter. Each pass smooths one extra cell
  // of boundary wobble. Three passes is enough to clean up real tile
  // photos without erasing intricate motifs.
  for (let p = 0; p < MAJORITY_PASSES; p++) {
    grid = majorityFilter(grid, centroids.length);
  }
  // Drop tiny speckled regions that survived the mode filter. A small
  // island or thin bridge between regions is almost always photo noise,
  // not a real feature — reassign to the dominant neighbor.
  grid = removeSmallComponents(grid, centroids.length, MIN_COMPONENT_CELLS);

  // Derive hex colors from OKLAB centroids.
  const layers: Record<string, string> = {};
  for (let i = 0; i < centroids.length; i++) {
    layers[`st${i}`] = oklabToHex(centroids[i]);
  }

  const svgText = buildSvg(grid, centroids);
  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;

  return {
    svgDataUrl,
    svgText,
    layers,
    grid,
    minCentroidDistance: minPairwiseDistance(centroids),
  };
}

/**
 * Remove clusters that had zero points assigned, remapping assignment
 * indices so the remaining clusters stay contiguous (0..n-1).
 */
function dropEmptyClusters(
  assignments: number[],
  centroids: Vec3[]
): { assignments: number[]; centroids: Vec3[] } {
  const counts = new Array<number>(centroids.length).fill(0);
  for (const a of assignments) counts[a]++;

  const remap = new Array<number>(centroids.length).fill(-1);
  const keptCentroids: Vec3[] = [];
  for (let i = 0; i < centroids.length; i++) {
    if (counts[i] === 0) continue;
    remap[i] = keptCentroids.length;
    keptCentroids.push(centroids[i]);
  }
  if (keptCentroids.length === centroids.length) {
    return { assignments, centroids };
  }
  const newAssignments = assignments.map((a) => remap[a]);
  return { assignments: newAssignments, centroids: keptCentroids };
}

function minPairwiseDistance(points: Vec3[]): number {
  if (points.length < 2) return Infinity;
  let min = Infinity;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const d = Math.sqrt(distSq(points[i], points[j]));
      if (d < min) min = d;
    }
  }
  return min;
}

// ---- Image loading ----

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

/**
 * Draw the image onto a TILE_PX × TILE_PX canvas and return the pixel
 * data as a flat Uint8ClampedArray (RGBA, row-major). When autoCrop is
 * on, trims uniform borders (photo edge, grout) from the source before
 * scaling, so the tile fills the analysis area.
 */
function rasterize(
  img: HTMLImageElement,
  { autoCrop }: { autoCrop: boolean }
): Uint8ClampedArray {
  const sw = img.naturalWidth || img.width;
  const sh = img.naturalHeight || img.height;

  let sx = 0, sy = 0, srcW = sw, srcH = sh;
  if (autoCrop) {
    const cropped = detectCropBounds(img, sw, sh);
    sx = cropped.x; sy = cropped.y; srcW = cropped.w; srcH = cropped.h;
  }

  const canvas = document.createElement('canvas');
  canvas.width = TILE_PX;
  canvas.height = TILE_PX;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, sx, sy, srcW, srcH, 0, 0, TILE_PX, TILE_PX);
  return ctx.getImageData(0, 0, TILE_PX, TILE_PX).data;
}

/**
 * Detect the bounding box of "content" in the image by walking inward
 * from each edge and skipping rows/cols whose pixel stddev is below a
 * threshold (i.e. near-uniform strips — grout, photo border, matte).
 */
function detectCropBounds(
  img: HTMLImageElement,
  sw: number,
  sh: number
): { x: number; y: number; w: number; h: number } {
  // Analyze at a moderate resolution to keep it cheap.
  const aw = Math.min(sw, 200);
  const ah = Math.min(sh, 200);
  const canvas = document.createElement('canvas');
  canvas.width = aw; canvas.height = ah;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, aw, ah);
  const data = ctx.getImageData(0, 0, aw, ah).data;

  const STDDEV_THRESHOLD = 14; // below this, treat as uniform.

  // Per-row stats.
  const rowStd = new Float32Array(ah);
  for (let y = 0; y < ah; y++) rowStd[y] = rowStdDev(data, aw, y);
  const colStd = new Float32Array(aw);
  for (let x = 0; x < aw; x++) colStd[x] = colStdDev(data, aw, ah, x);

  let top = 0, bottom = ah - 1, left = 0, right = aw - 1;
  while (top < ah / 2 && rowStd[top] < STDDEV_THRESHOLD) top++;
  while (bottom > ah / 2 && rowStd[bottom] < STDDEV_THRESHOLD) bottom--;
  while (left < aw / 2 && colStd[left] < STDDEV_THRESHOLD) left++;
  while (right > aw / 2 && colStd[right] < STDDEV_THRESHOLD) right--;

  // Don't crop more aggressively than 20% of each side; if we hit the
  // midpoint it means the image really is that uniform — give up.
  const maxTrim = 0.2;
  top = Math.min(top, Math.floor(ah * maxTrim));
  left = Math.min(left, Math.floor(aw * maxTrim));
  bottom = Math.max(bottom, Math.ceil(ah * (1 - maxTrim)) - 1);
  right = Math.max(right, Math.ceil(aw * (1 - maxTrim)) - 1);

  // Map analysis-space bounds back to source-image space.
  return {
    x: Math.round((left / aw) * sw),
    y: Math.round((top / ah) * sh),
    w: Math.round(((right - left + 1) / aw) * sw),
    h: Math.round(((bottom - top + 1) / ah) * sh),
  };
}

function rowStdDev(data: Uint8ClampedArray, w: number, y: number): number {
  let mean = 0;
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    mean += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  mean /= w;
  let v = 0;
  for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    v += (lum - mean) * (lum - mean);
  }
  return Math.sqrt(v / w);
}

function colStdDev(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x: number
): number {
  let mean = 0;
  for (let y = 0; y < h; y++) {
    const i = (y * w + x) * 4;
    mean += (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  mean /= h;
  let v = 0;
  for (let y = 0; y < h; y++) {
    const i = (y * w + x) * 4;
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    v += (lum - mean) * (lum - mean);
  }
  return Math.sqrt(v / h);
}

/**
 * Luminance-only 1%–99% percentile stretch. Computes a luminance
 * histogram, picks the low/high percentiles, then remaps each pixel
 * by scaling all 3 channels uniformly by (newL / oldL). This stretches
 * contrast without shifting hue or saturation.
 *
 * Previous version stretched each R/G/B channel independently, which
 * catastrophically hue-shifted limited-palette images (a yellow+white
 * checkerboard turned red+cyan because the blue channel's narrow range
 * got blown up). Luminance-only stretch is the correct photo-neutral
 * equivalent of a global curves adjustment.
 */
function applyAutoLevels(pixels: Uint8ClampedArray): void {
  const total = pixels.length / 4;
  if (total === 0) return;

  // Rec. 709 luminance weights for sRGB.
  const lumAt = (i: number) =>
    0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];

  // Build luminance histogram at 8-bit resolution.
  const hist = new Uint32Array(256);
  for (let i = 0; i < pixels.length; i += 4) {
    hist[Math.round(lumAt(i)) & 0xff]++;
  }

  const loTarget = Math.floor(total * 0.01);
  const hiTarget = Math.floor(total * 0.99);
  let cum = 0, lo = 0, hi = 255;
  for (let v = 0; v < 256; v++) {
    cum += hist[v];
    if (cum >= loTarget) { lo = v; break; }
  }
  cum = 0;
  for (let v = 0; v < 256; v++) {
    cum += hist[v];
    if (cum >= hiTarget) { hi = v; break; }
  }
  const range = hi - lo;
  // Skip when the range is too narrow (blows up near-uniform images) OR
  // when the would-be stretch factor is large. A large factor means the
  // image already uses a limited palette (a 2-color tile, a render) and
  // stretching would distort colors rather than correct exposure.
  if (range < 8) return;
  const stretchFactor = 255 / range;
  if (stretchFactor > 2) return;
  for (let i = 0; i < pixels.length; i += 4) {
    const L = lumAt(i);
    if (L <= 0) continue; // pure black — leave alone
    const Lnew = Math.max(0, Math.min(255, ((L - lo) * 255) / range));
    const factor = Lnew / L;
    pixels[i]     = Math.max(0, Math.min(255, Math.round(pixels[i]     * factor)));
    pixels[i + 1] = Math.max(0, Math.min(255, Math.round(pixels[i + 1] * factor)));
    pixels[i + 2] = Math.max(0, Math.min(255, Math.round(pixels[i + 2] * factor)));
  }
}

// ---- Downsampling ----

/** Average the pixel colors within each cell. Uses integer pixel
 *  bounds derived from the fractional CELL_PX so non-integer cell
 *  sizes work cleanly (e.g. CELL_PX=2.5 for GRID=160, TILE_PX=400). */
function downsample(pixels: Uint8ClampedArray): Vec3[] {
  const cells: Vec3[] = [];
  for (let row = 0; row < GRID; row++) {
    const y0 = Math.floor(row * CELL_PX);
    const y1 = Math.max(y0 + 1, Math.floor((row + 1) * CELL_PX));
    for (let col = 0; col < GRID; col++) {
      const x0 = Math.floor(col * CELL_PX);
      const x1 = Math.max(x0 + 1, Math.floor((col + 1) * CELL_PX));
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * TILE_PX + x) * 4;
          rSum += pixels[i];
          gSum += pixels[i + 1];
          bSum += pixels[i + 2];
          count++;
        }
      }
      cells.push([rSum / count, gSum / count, bSum / count]);
    }
  }
  return cells;
}

/**
 * Average each cell with its symmetry partners so the cluster input
 * already respects the tile's symmetry. Huge denoising win on real
 * tile photos since the same motif usually repeats across quadrants.
 *
 *   2fold → 180° rotation (c -> GRID-1-c, r -> GRID-1-r)
 *   4fold → 90°/180°/270° rotations
 */
function enforceSymmetry(cells: Vec3[], kind: Symmetry): Vec3[] {
  if (kind === 'none') return cells;
  const out: Vec3[] = cells.map((c) => [...c] as Vec3);
  const seen = new Uint8Array(GRID * GRID);

  const rotations: ((r: number, c: number) => [number, number])[] =
    kind === '2fold'
      ? [(r, c) => [r, c], (r, c) => [GRID - 1 - r, GRID - 1 - c]]
      : [
          (r, c) => [r, c],
          (r, c) => [c, GRID - 1 - r],
          (r, c) => [GRID - 1 - r, GRID - 1 - c],
          (r, c) => [GRID - 1 - c, r],
        ];

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const idx = r * GRID + c;
      if (seen[idx]) continue;
      const orbit: number[] = [];
      for (const rot of rotations) {
        const [rr, cc] = rot(r, c);
        orbit.push(rr * GRID + cc);
      }
      // Average colors across the orbit.
      let sr = 0, sg = 0, sb = 0;
      for (const i of orbit) {
        sr += cells[i][0];
        sg += cells[i][1];
        sb += cells[i][2];
      }
      const n = orbit.length;
      const avg: Vec3 = [sr / n, sg / n, sb / n];
      for (const i of orbit) {
        out[i] = [...avg];
        seen[i] = 1;
      }
    }
  }
  return out;
}

function toGrid(assignments: number[]): number[][] {
  const grid: number[][] = [];
  for (let row = 0; row < GRID; row++) {
    const r: number[] = [];
    for (let col = 0; col < GRID; col++) {
      r.push(assignments[row * GRID + col]);
    }
    grid.push(r);
  }
  return grid;
}

// ---- K-means clustering (generic on 3-D vectors) ----

type Vec3 = [number, number, number];

function kmeans(
  points: Vec3[],
  k: number,
  maxIter: number
): { assignments: number[]; centroids: Vec3[] } {
  const n = points.length;
  if (k >= n) {
    return {
      assignments: points.map((_, i) => Math.min(i, k - 1)),
      centroids: points.slice(0, k).map((p) => [...p] as Vec3),
    };
  }

  const centroids = kmeansppInit(points, k);
  const assignments = new Array<number>(n).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false;
    for (let i = 0; i < n; i++) {
      let bestDist = Infinity;
      let bestC = 0;
      for (let c = 0; c < k; c++) {
        const d = distSq(points[i], centroids[c]);
        if (d < bestDist) {
          bestDist = d;
          bestC = c;
        }
      }
      if (assignments[i] !== bestC) {
        assignments[i] = bestC;
        changed = true;
      }
    }

    if (!changed) break;

    const sums = Array.from({ length: k }, () => [0, 0, 0]);
    const counts = new Array<number>(k).fill(0);
    for (let i = 0; i < n; i++) {
      const c = assignments[i];
      sums[c][0] += points[i][0];
      sums[c][1] += points[i][1];
      sums[c][2] += points[i][2];
      counts[c]++;
    }
    for (let c = 0; c < k; c++) {
      if (counts[c] === 0) continue;
      centroids[c] = [
        sums[c][0] / counts[c],
        sums[c][1] / counts[c],
        sums[c][2] / counts[c],
      ];
    }
  }

  return { assignments, centroids };
}

/** K-means++ initialization: pick centroids spread across vector space. */
function kmeansppInit(points: Vec3[], k: number): Vec3[] {
  const n = points.length;
  const centroids: Vec3[] = [];

  const first = Math.floor(Math.random() * n);
  centroids.push([...points[first]]);

  const dist = new Float64Array(n).fill(Infinity);

  for (let c = 1; c < k; c++) {
    const last = centroids[c - 1];
    for (let i = 0; i < n; i++) {
      dist[i] = Math.min(dist[i], distSq(points[i], last));
    }

    let total = 0;
    for (let i = 0; i < n; i++) total += dist[i];
    // Degenerate case: every remaining point is already a centroid, so
    // nothing is "far." Fall back to a random point rather than always
    // picking index 0 (which would duplicate the first centroid).
    if (total <= 0) {
      centroids.push([...points[Math.floor(Math.random() * n)]]);
      continue;
    }
    let r = Math.random() * total;
    let picked = 0;
    for (let i = 0; i < n; i++) {
      r -= dist[i];
      if (r <= 0) {
        picked = i;
        break;
      }
    }
    centroids.push([...points[picked]]);
  }

  return centroids;
}

function distSq(a: Vec3, b: Vec3): number {
  const d0 = a[0] - b[0];
  const d1 = a[1] - b[1];
  const d2 = a[2] - b[2];
  return d0 * d0 + d1 * d1 + d2 * d2;
}

// ---- Majority (mode) filter ----

/**
 * Replace each cell with the most common layer in its 3×3 neighborhood.
 * Kills isolated speckle at cluster boundaries. Single pass.
 */
function majorityFilter(grid: number[][], k: number): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const out: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));
  const counts = new Array<number>(k).fill(0);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      counts.fill(0);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr;
          const cc = c + dc;
          if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) continue;
          counts[grid[rr][cc]]++;
        }
      }
      // Find mode, break ties by preferring the current cell's label so
      // stable regions don't drift.
      let best = grid[r][c];
      let bestCount = counts[best];
      for (let i = 0; i < k; i++) {
        if (counts[i] > bestCount) {
          bestCount = counts[i];
          best = i;
        }
      }
      out[r][c] = best;
    }
  }
  return out;
}

/**
 * Find connected components smaller than `minSize` cells and reassign
 * each of their cells to the most common neighboring label. Kills
 * thin bridges and isolated specks that survived the majority filter
 * on noisy photo inputs.
 */
function removeSmallComponents(
  grid: number[][],
  k: number,
  minSize: number
): number[][] {
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Uint8Array(rows * cols);
  const out = grid.map((r) => [...r]);

  // Flood-fill each unvisited cell to find its component.
  for (let r0 = 0; r0 < rows; r0++) {
    for (let c0 = 0; c0 < cols; c0++) {
      if (visited[r0 * cols + c0]) continue;
      const label = grid[r0][c0];
      const stack: Array<[number, number]> = [[r0, c0]];
      const cells: Array<[number, number]> = [];
      while (stack.length) {
        const [r, c] = stack.pop()!;
        const idx = r * cols + c;
        if (visited[idx]) continue;
        if (grid[r][c] !== label) continue;
        visited[idx] = 1;
        cells.push([r, c]);
        if (r > 0) stack.push([r - 1, c]);
        if (r < rows - 1) stack.push([r + 1, c]);
        if (c > 0) stack.push([r, c - 1]);
        if (c < cols - 1) stack.push([r, c + 1]);
      }
      if (cells.length >= minSize) continue;

      // Count neighbor labels of the small component.
      const neighborCounts = new Array<number>(k).fill(0);
      for (const [r, c] of cells) {
        const ns: Array<[number, number]> = [
          [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1],
        ];
        for (const [nr, nc] of ns) {
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          const nLabel = grid[nr][nc];
          if (nLabel !== label) neighborCounts[nLabel]++;
        }
      }
      let bestLabel = label;
      let bestCount = -1;
      for (let i = 0; i < k; i++) {
        if (i === label) continue;
        if (neighborCounts[i] > bestCount) {
          bestCount = neighborCounts[i];
          bestLabel = i;
        }
      }
      if (bestLabel === label) continue; // isolated — no other neighbors
      for (const [r, c] of cells) out[r][c] = bestLabel;
    }
  }
  return out;
}

// ---- SVG generation ----

/**
 * Emit one <path> per layer, where the path is the traced contour of
 * every connected region assigned to that layer. Multiple disjoint
 * regions become separate subpaths ('M ... Z M ... Z') on the same
 * path. Produces dramatically cleaner output than a rect mosaic and
 * works naturally with fill-rule="evenodd" for holes.
 */
function buildSvg(grid: number[][], centroids: Vec3[]): string {
  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_PX} ${TILE_PX}">`
  );

  for (let layer = 0; layer < centroids.length; layer++) {
    const loops = tracePolygons(grid, layer);
    if (loops.length === 0) continue;
    const hex = oklabToHex(centroids[layer]);
    const d = loops
      .map((loop) => {
        const simplified = simplifyPolygon(loop);
        const head = simplified[0];
        const parts: string[] = [`M${head[0] * CELL_PX} ${head[1] * CELL_PX}`];
        for (let i = 1; i < simplified.length; i++) {
          const p = simplified[i];
          parts.push(`L${p[0] * CELL_PX} ${p[1] * CELL_PX}`);
        }
        parts.push('Z');
        return parts.join(' ');
      })
      .join(' ');
    lines.push(
      `  <path d="${d}" fill="${hex}" fill-rule="evenodd" class="colora st${layer}"/>`
    );
  }

  lines.push('</svg>');
  return lines.join('\n');
}

// ---- Contour tracing ----

type Point = [number, number];

/**
 * Trace the boundary polygons of every connected region assigned to
 * `layer`. Each polygon is a closed loop of grid-aligned points (in
 * cell-corner coordinates, 0..GRID). Walks oriented boundary edges
 * so that interior is on the left of travel; at pinch points picks
 * the tightest clockwise turn to keep loops disjoint.
 */
function tracePolygons(grid: number[][], layer: number): Point[][] {
  const rows = grid.length;
  const cols = grid[0].length;

  // Collect every oriented boundary edge. For each cell of `layer`,
  // emit any of its 4 edges whose neighbor across that edge is either
  // off-grid or a different layer. Orientation goes CCW around each
  // cell, so interior ends up on the left of the travel direction.
  const edges: Array<[Point, Point]> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] !== layer) continue;
      if (r === 0 || grid[r - 1][c] !== layer) edges.push([[c, r], [c + 1, r]]);
      if (c === cols - 1 || grid[r][c + 1] !== layer)
        edges.push([[c + 1, r], [c + 1, r + 1]]);
      if (r === rows - 1 || grid[r + 1][c] !== layer)
        edges.push([[c + 1, r + 1], [c, r + 1]]);
      if (c === 0 || grid[r][c - 1] !== layer)
        edges.push([[c, r + 1], [c, r]]);
    }
  }

  // Index edges by their start point for chaining.
  const startMap = new Map<string, Array<[Point, Point]>>();
  for (const e of edges) {
    const k = keyPoint(e[0]);
    let list = startMap.get(k);
    if (!list) startMap.set(k, (list = []));
    list.push(e);
  }
  const used = new Set<string>();

  const loops: Point[][] = [];
  for (const seed of edges) {
    if (used.has(keyEdge(seed))) continue;
    const loop: Point[] = [seed[0]];
    let cur: [Point, Point] = seed;
    while (true) {
      used.add(keyEdge(cur));
      loop.push(cur[1]);
      if (cur[1][0] === seed[0][0] && cur[1][1] === seed[0][1]) {
        loop.pop();
        break;
      }
      const options = startMap.get(keyPoint(cur[1])) ?? [];
      const inDir = dirIndex(cur[1][0] - cur[0][0], cur[1][1] - cur[0][1]);
      // Pick the outgoing edge with the smallest clockwise turn.
      let best: [Point, Point] | null = null;
      let bestTurn = 99;
      for (const cand of options) {
        if (used.has(keyEdge(cand))) continue;
        const outDir = dirIndex(cand[1][0] - cand[0][0], cand[1][1] - cand[0][1]);
        const turn = (outDir - inDir + 4) % 4;
        if (turn < bestTurn) { bestTurn = turn; best = cand; }
      }
      if (!best) break;
      cur = best;
    }
    if (loop.length >= 3) loops.push(loop);
  }
  return loops;
}

function keyPoint(p: Point): string {
  return `${p[0]},${p[1]}`;
}
function keyEdge(e: [Point, Point]): string {
  return `${e[0][0]},${e[0][1]}>${e[1][0]},${e[1][1]}`;
}
function dirIndex(dx: number, dy: number): number {
  if (dx > 0) return 0;
  if (dy > 0) return 1;
  if (dx < 0) return 2;
  return 3;
}

/** Polygon simplification: drop collinear vertices, run Douglas-Peucker,
 *  then snap near-axis-aligned segments to true horizontal/vertical.
 *  The snap pass is what finally straightens the tile borders that
 *  the user could still see wobbling after DP alone. */
function simplifyPolygon(loop: Point[]): Point[] {
  const collinear = dropCollinear(loop);
  if (collinear.length < 4) return collinear;
  const simplified = douglasPeuckerClosed(collinear, DP_EPSILON);
  return snapAxisAligned(simplified);
}

/**
 * For each segment of the polygon, if it's "essentially horizontal"
 * (|dx|/|dy| ≥ SNAP_RATIO) or "essentially vertical", cast votes for
 * its endpoints to share a common y (horizontal) or common x
 * (vertical). After scanning all segments, each vertex is reassigned
 * to the average of its votes. On a rectangular region every vertex
 * gets exactly one x vote and one y vote, producing a perfect rect.
 * Diagonal or curved regions accumulate no votes on the relevant
 * axis and are left untouched.
 */
function snapAxisAligned(loop: Point[]): Point[] {
  const n = loop.length;
  if (n < 3) return loop;

  const xVotes: number[][] = Array.from({ length: n }, () => []);
  const yVotes: number[][] = Array.from({ length: n }, () => []);

  for (let i = 0; i < n; i++) {
    const a = loop[i];
    const b = loop[(i + 1) % n];
    const dx = Math.abs(b[0] - a[0]);
    const dy = Math.abs(b[1] - a[1]);
    if (dx === 0 && dy === 0) continue;
    // Only snap runs that are *long* on their major axis. Short
    // segments in small curves stay untouched so small circles/arcs
    // don't get polygonized.
    if (dx >= SNAP_MIN_LEN && dy * SNAP_RATIO <= dx) {
      const medY = (a[1] + b[1]) / 2;
      yVotes[i].push(medY);
      yVotes[(i + 1) % n].push(medY);
    } else if (dy >= SNAP_MIN_LEN && dx * SNAP_RATIO <= dy) {
      const medX = (a[0] + b[0]) / 2;
      xVotes[i].push(medX);
      xVotes[(i + 1) % n].push(medX);
    }
  }

  return loop.map((p, i) => {
    const xs = xVotes[i];
    const ys = yVotes[i];
    return [
      xs.length ? xs.reduce((s, v) => s + v, 0) / xs.length : p[0],
      ys.length ? ys.reduce((s, v) => s + v, 0) / ys.length : p[1],
    ] as Point;
  });
}

/** Slope cutoff for axis-alignment: |long|/|short| must be ≥ this.
 *  4 means segments flatter than ~14° count as horizontal. Segments
 *  at 45° or steeper stay as-is (preserves real diagonals). */
const SNAP_RATIO = 4;

/** Minimum length (cell units) of a segment's major axis to be a
 *  snap candidate. Scaled with GRID so the physical threshold
 *  (~50 px) matches what worked at GRID=80. */
const SNAP_MIN_LEN = 20;

/** Douglas-Peucker epsilon in cell-corner units. Scales with GRID so
 *  the physical tolerance (~7.5 px here at GRID=160) matches what
 *  was used at GRID=80 — same visible smoothing, finer quantization. */
const DP_EPSILON = 3.0;

function dropCollinear(loop: Point[]): Point[] {
  const n = loop.length;
  if (n < 3) return loop;
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    const prev = loop[(i - 1 + n) % n];
    const cur = loop[i];
    const next = loop[(i + 1) % n];
    const dx1 = cur[0] - prev[0], dy1 = cur[1] - prev[1];
    const dx2 = next[0] - cur[0], dy2 = next[1] - cur[1];
    if (dx1 * dy2 - dy1 * dx2 === 0) continue;
    out.push(cur);
  }
  return out;
}

/**
 * Douglas-Peucker simplification for a closed polygon. To avoid the
 * arbitrary-starting-point problem, we split the loop at the two
 * farthest-apart vertices (which are guaranteed to be real corners),
 * simplify each arc, and rejoin.
 */
function douglasPeuckerClosed(loop: Point[], epsilon: number): Point[] {
  const n = loop.length;
  if (n < 4) return loop;

  // Find the two farthest points — they survive any simplification.
  let aIdx = 0, bIdx = 0, bestSq = -1;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = loop[i][0] - loop[j][0];
      const dy = loop[i][1] - loop[j][1];
      const d = dx * dx + dy * dy;
      if (d > bestSq) { bestSq = d; aIdx = i; bIdx = j; }
    }
  }
  const arc1: Point[] = [];
  const arc2: Point[] = [];
  for (let i = aIdx; i !== bIdx; i = (i + 1) % n) arc1.push(loop[i]);
  arc1.push(loop[bIdx]);
  for (let i = bIdx; i !== aIdx; i = (i + 1) % n) arc2.push(loop[i]);
  arc2.push(loop[aIdx]);

  const simp1 = dpOpen(arc1, epsilon);
  const simp2 = dpOpen(arc2, epsilon);
  // Stitch: simp1 ends at bIdx which equals simp2[0]; skip duplicate.
  return [...simp1.slice(0, -1), ...simp2.slice(0, -1)];
}

function dpOpen(pts: Point[], epsilon: number): Point[] {
  if (pts.length < 3) return pts;
  const first = pts[0];
  const last = pts[pts.length - 1];
  let maxD = 0;
  let maxI = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], first, last);
    if (d > maxD) { maxD = d; maxI = i; }
  }
  if (maxD > epsilon) {
    const left = dpOpen(pts.slice(0, maxI + 1), epsilon);
    const right = dpOpen(pts.slice(maxI), epsilon);
    return [...left.slice(0, -1), ...right];
  }
  return [first, last];
}

function perpDist(p: Point, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) {
    const ex = p[0] - a[0], ey = p[1] - a[1];
    return Math.sqrt(ex * ex + ey * ey);
  }
  // Perpendicular distance from p to line a→b.
  const num = Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]);
  return num / Math.sqrt(len2);
}

// ---- Color space conversions ----
//
// sRGB ↔ linear RGB ↔ OKLAB. OKLAB is perceptually uniform, so Euclidean
// distance in OKLAB matches human judgments of "how different these colors
// look" much better than raw RGB distance.

function srgbToLinear(c: number): number {
  const cn = c / 255;
  return cn <= 0.04045 ? cn / 12.92 : Math.pow((cn + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}

function rgbToOklab(rgb: Vec3): Vec3 {
  const r = srgbToLinear(rgb[0]);
  const g = srgbToLinear(rgb[1]);
  const b = srgbToLinear(rgb[2]);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return [
    0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  ];
}

function oklabToRgb(lab: Vec3): Vec3 {
  const L = lab[0];
  const a = lab[1];
  const b = lab[2];

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ];
}

function oklabToHex(lab: Vec3): string {
  return rgbToHex(oklabToRgb(lab));
}

function rgbToHex(rgb: Vec3): string {
  return (
    '#' +
    rgb
      .map((v) =>
        Math.max(0, Math.min(255, Math.round(v)))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}
