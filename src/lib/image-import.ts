// Image-to-tile import pipeline.
//
// Takes a raster image (from a photo of a real tile) and converts it
// into an SVG with `colora stN` layers that the editor can recolor.
//
// Pipeline:
//   1. Render image to a canvas at TILE_PX × TILE_PX
//   2. Downsample to a GRID × GRID cell grid (average color per cell)
//   3. K-means clustering on cell colors → N layers
//   4. For each layer, emit <rect> elements for its cells
//   5. Wrap in an SVG with viewBox="0 0 TILE_PX TILE_PX"
//
// The "mosaic of rects" approach is simple, produces manageable SVGs
// (~GRID² rects max), and visually suits a tile design tool. Contour
// tracing can be added later for smoother output.

// ---- Constants ----

/** Tile canvas size in pixels. */
const TILE_PX = 400;

/** Grid resolution: number of cells per axis. 40 → 1600 cells max. */
const GRID = 40;

/** Pixels per cell. */
const CELL_PX = TILE_PX / GRID;

// ---- Public API ----

export interface ImportResult {
  /** Data-URL SVG ready to use as a TileSource.svgUrl. */
  svgDataUrl: string;
  /** Raw SVG markup. */
  svgText: string;
  /** Detected layers: layer id → hex color. */
  layers: Record<string, string>;
  /** The quantized image as a grid of layer assignments (for debugging). */
  grid: number[][];
}

export interface ImportOptions {
  /** Number of color clusters / layers. Default 5. */
  layerCount?: number;
  /** K-means iteration cap. Default 20. */
  maxIterations?: number;
}

/**
 * Process a raster image file into an SVG tile with recolorable layers.
 * Runs entirely on the client via canvas + k-means.
 */
export async function importImageAsTile(
  file: File,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const { layerCount = 5, maxIterations = 20 } = options;

  // 1. Load image to canvas
  const img = await loadImage(file);
  const pixels = rasterize(img);

  // 2. Downsample to cell grid
  const cellColors = downsample(pixels);

  // 3. K-means clustering
  const { assignments, centroids } = kmeans(cellColors, layerCount, maxIterations);

  // 4. Build grid of layer assignments
  const grid: number[][] = [];
  for (let row = 0; row < GRID; row++) {
    const r: number[] = [];
    for (let col = 0; col < GRID; col++) {
      r.push(assignments[row * GRID + col]);
    }
    grid.push(r);
  }

  // 5. Generate SVG
  const layers: Record<string, string> = {};
  for (let i = 0; i < centroids.length; i++) {
    layers[`st${i}`] = rgbToHex(centroids[i]);
  }

  const svgText = buildSvg(grid, centroids);
  const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;

  return { svgDataUrl, svgText, layers, grid };
}

// ---- Image loading ----

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Draw the image onto a TILE_PX × TILE_PX canvas and return the
 * pixel data as a flat Uint8ClampedArray (RGBA, row-major).
 */
function rasterize(img: HTMLImageElement): Uint8ClampedArray {
  const canvas = document.createElement('canvas');
  canvas.width = TILE_PX;
  canvas.height = TILE_PX;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, TILE_PX, TILE_PX);
  return ctx.getImageData(0, 0, TILE_PX, TILE_PX).data;
}

// ---- Downsampling ----

/** Average the pixel colors within each CELL_PX × CELL_PX cell. */
function downsample(pixels: Uint8ClampedArray): [number, number, number][] {
  const cells: [number, number, number][] = [];
  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      const y0 = row * CELL_PX;
      const x0 = col * CELL_PX;
      for (let dy = 0; dy < CELL_PX; dy++) {
        for (let dx = 0; dx < CELL_PX; dx++) {
          const i = ((y0 + dy) * TILE_PX + (x0 + dx)) * 4;
          rSum += pixels[i];
          gSum += pixels[i + 1];
          bSum += pixels[i + 2];
          count++;
        }
      }
      cells.push([
        Math.round(rSum / count),
        Math.round(gSum / count),
        Math.round(bSum / count),
      ]);
    }
  }
  return cells;
}

// ---- K-means clustering ----

type RGB = [number, number, number];

function kmeans(
  points: RGB[],
  k: number,
  maxIter: number
): { assignments: number[]; centroids: RGB[] } {
  const n = points.length;
  if (k >= n) {
    // Degenerate: more clusters than points — each point is its own.
    return {
      assignments: points.map((_, i) => Math.min(i, k - 1)),
      centroids: points.slice(0, k).map((p) => [...p] as RGB),
    };
  }

  // Initialize centroids via k-means++ for better convergence.
  const centroids = kmeansppInit(points, k);
  const assignments = new Array<number>(n).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    // Assign each point to nearest centroid.
    let changed = false;
    for (let i = 0; i < n; i++) {
      let bestDist = Infinity;
      let bestC = 0;
      for (let c = 0; c < k; c++) {
        const d = colorDistSq(points[i], centroids[c]);
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

    // Recompute centroids.
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
        Math.round(sums[c][0] / counts[c]),
        Math.round(sums[c][1] / counts[c]),
        Math.round(sums[c][2] / counts[c]),
      ];
    }
  }

  return { assignments, centroids };
}

/** K-means++ initialization: pick centroids spread across color space. */
function kmeansppInit(points: RGB[], k: number): RGB[] {
  const n = points.length;
  const centroids: RGB[] = [];

  // First centroid: random point.
  const first = Math.floor(Math.random() * n);
  centroids.push([...points[first]]);

  const dist = new Float64Array(n).fill(Infinity);

  for (let c = 1; c < k; c++) {
    // Update distances to nearest existing centroid.
    const last = centroids[c - 1];
    for (let i = 0; i < n; i++) {
      dist[i] = Math.min(dist[i], colorDistSq(points[i], last));
    }

    // Weighted random selection proportional to distance².
    let total = 0;
    for (let i = 0; i < n; i++) total += dist[i];
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

function colorDistSq(a: RGB, b: RGB): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return dr * dr + dg * dg + db * db;
}

// ---- SVG generation ----

function buildSvg(grid: number[][], centroids: RGB[]): string {
  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${TILE_PX} ${TILE_PX}">`
  );

  // Group rects by layer so the SVG structure matches what the editor
  // expects: all shapes for a layer share the same `colora stN` class.
  for (let layer = 0; layer < centroids.length; layer++) {
    const hex = rgbToHex(centroids[layer]);
    for (let row = 0; row < GRID; row++) {
      for (let col = 0; col < GRID; col++) {
        if (grid[row][col] !== layer) continue;
        const x = col * CELL_PX;
        const y = row * CELL_PX;
        lines.push(
          `  <rect x="${x}" y="${y}" width="${CELL_PX}" height="${CELL_PX}" fill="${hex}" class="colora st${layer}"/>`
        );
      }
    }
  }

  lines.push('</svg>');
  return lines.join('\n');
}

// ---- Helpers ----

function rgbToHex(rgb: RGB): string {
  return (
    '#' +
    rgb
      .map((v) =>
        Math.max(0, Math.min(255, v))
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  );
}
