// Renders a backend PipelineOutput by tiling its atoms across the
// visible canvas using the lattice basis vectors and per-cell
// transforms. Works for the v1 case (single atom, 1×1 lattice, identity
// transform) and for general N-atom multi-cell output without changes.
//
// Coordinate system: lattice basis vectors are expressed in the same
// units as each atom's SVG viewBox. So a 585×1040 atom with
// basis_a=[585,0], basis_b=[0,1040] tiles seamlessly edge-to-edge.
//
// Recolor model: each `<path class="layer-N">` is rewritten at parse
// time to `style="fill: var(--habaneta-layer-N)"`. Layer/contour colors
// are exposed as CSS custom properties on the wrapping element. CSS
// variables inherit through the `<use>` shadow boundary, so changing a
// color is a single inline-style update on the wrapper — no re-parse,
// no SVG re-render.

import React, { useMemo } from 'react';
import {
  Cell,
  Lattice,
  PipelineOutput,
  Transform,
  Vec2,
} from '../../lib/habanetaBackend';
import { Dict } from '../../context/interfaces';
import { sanitizeSvg } from '../../lib/svg-sanitize';

interface Props {
  pipeline: PipelineOutput;
  /**
   * Render mode:
   *  - `'tile'` (default): tile the lattice across a fixed-pixel canvas;
   *    requires `width` and `height`. Used by the import dialog so the
   *    user sees seamless repetition.
   *  - `'single'`: render exactly one atom (the first cell), responsive
   *    to its container via `100%` SVG dims and `viewBox`-based scaling.
   *    Used for thumbnails / editor surfaces where pixel dims aren't
   *    known up front.
   */
  mode?: 'tile' | 'single';
  /** CSS width in pixels. Required in `tile` mode. */
  width?: number;
  /** CSS height in pixels. Required in `tile` mode. */
  height?: number;
  /** How many lattice repeats to fit horizontally. Default 2. (tile mode only) */
  repeats?: number;
  /**
   * Optional per-class color overrides keyed by SVG class name
   * (`"layer-0"`, `"layer-1"`, …, `"contour"`). Missing keys fall
   * back to the pipeline's `palette` / `contour` defaults.
   */
  layers?: Dict<string>;
  className?: string;
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const LAYER_VAR_PREFIX = '--habaneta-layer-';
const CONTOUR_VAR = '--habaneta-contour';

interface ParsedAtom {
  id: string;
  viewBox: string;
  width: number;
  height: number;
  inner: string;
}

function parseAtom(id: string, rawSvg: string): ParsedAtom {
  const safe = sanitizeSvg(rawSvg);
  const doc = new DOMParser().parseFromString(safe, 'image/svg+xml');
  const root = doc.documentElement;
  if (root.nodeName.toLowerCase() !== 'svg') {
    throw new Error(`atom ${id}: expected <svg> root, got <${root.nodeName}>`);
  }
  const viewBox = root.getAttribute('viewBox') ?? '';
  const [, , wStr, hStr] = viewBox.split(/\s+/);
  const width = Number(wStr);
  const height = Number(hStr);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error(`atom ${id}: invalid viewBox "${viewBox}"`);
  }

  // Bind every classed path to a CSS variable. Untouched paths
  // (class doesn't match layer-N or contour) keep whatever fill the
  // backend gave them, which today is none — they'll inherit the
  // svg's currentColor / browser default. That's deliberate: only the
  // backend's documented classes participate in recolor.
  //
  // Contract assumption: classes are *single-token* — `class="layer-0"`
  // / `class="contour"`, never `class="layer-0 highlighted"`. Exact
  // string match is intentional. If the backend ever emits multi-class
  // paths, switch to `cls.split(/\s+/).some(...)`.
  for (const el of Array.from(root.querySelectorAll('[class]'))) {
    const cls = el.getAttribute('class') ?? '';
    if (cls === 'contour') {
      el.setAttribute('style', `fill: var(${CONTOUR_VAR})`);
    } else {
      const m = cls.match(/^layer-(\d+)$/);
      if (m) {
        el.setAttribute('style', `fill: var(${LAYER_VAR_PREFIX}${m[1]})`);
      }
    }
  }

  return { id, viewBox, width, height, inner: root.innerHTML };
}

function cellTransformString(
  t: Transform,
  atomW: number,
  atomH: number
): string {
  const cx = atomW / 2;
  const cy = atomH / 2;
  switch (t.kind) {
    case 'identity':
      return '';
    case 'rotate':
      return `rotate(${t.degrees} ${cx} ${cy})`;
    case 'reflect': {
      // Reflect across the axis through (cx, cy) at axis_degrees from
      // horizontal. The 2D reflection matrix about a line through the
      // origin at angle θ is [[cos2θ, sin2θ],[sin2θ, -cos2θ]]. We
      // pre/post-translate so the line passes through the atom center.
      const θ = (t.axis_degrees * Math.PI) / 180;
      const c = Math.cos(2 * θ);
      const s = Math.sin(2 * θ);
      const a = c;
      const b = s;
      const cc = s;
      const d = -c;
      const e = cx - a * cx - cc * cy;
      const f = cy - b * cx - d * cy;
      return `matrix(${a} ${b} ${cc} ${d} ${e} ${f})`;
    }
  }
}

function invert2(basis_a: Vec2, basis_b: Vec2): [Vec2, Vec2] | null {
  const [ax, ay] = basis_a;
  const [bx, by] = basis_b;
  const det = ax * by - bx * ay;
  if (Math.abs(det) < 1e-9) return null;
  const inv = 1 / det;
  return [
    [by * inv, -ay * inv],
    [-bx * inv, ax * inv],
  ];
}

function tileBounds(
  lattice: Lattice,
  worldW: number,
  worldH: number
): { iMin: number; iMax: number; jMin: number; jMax: number } | null {
  const inv = invert2(lattice.basis_a, lattice.basis_b);
  if (!inv) return null;
  const corners: Vec2[] = [
    [0, 0],
    [worldW, 0],
    [0, worldH],
    [worldW, worldH],
  ];
  let iMin = Infinity;
  let iMax = -Infinity;
  let jMin = Infinity;
  let jMax = -Infinity;
  for (const [x, y] of corners) {
    const i = inv[0][0] * x + inv[0][1] * y;
    const j = inv[1][0] * x + inv[1][1] * y;
    if (i < iMin) iMin = i;
    if (i > iMax) iMax = i;
    if (j < jMin) jMin = j;
    if (j > jMax) jMax = j;
  }
  return {
    iMin: Math.floor(iMin) - 1,
    iMax: Math.ceil(iMax) + 1,
    jMin: Math.floor(jMin) - 1,
    jMax: Math.ceil(jMax) + 1,
  };
}

const CompositionCanvas: React.FC<Props> = ({
  pipeline,
  mode = 'tile',
  width,
  height,
  repeats = 2,
  layers,
  className,
  style,
  onClick,
}) => {
  // Markup depends only on geometry and atoms — never on colors.
  // Colors are CSS variables on the wrapper, so recolor doesn't bust
  // this memo or rebuild any DOM.
  const svgMarkup = useMemo(() => {
    if (mode === 'single') {
      return buildSingleMarkup(pipeline);
    }
    if (width == null || height == null) {
      throw new Error('CompositionCanvas: tile mode requires width and height');
    }
    return buildTileMarkup(pipeline, width, height, repeats);
  }, [pipeline, mode, width, height, repeats]);

  const cssVars = useMemo(
    () => buildCssVars(pipeline, layers),
    [pipeline, layers]
  );

  const wrapperStyle: React.CSSProperties = {
    ...(mode === 'tile' ? { width, height } : { width: '100%', height: '100%' }),
    ...cssVars,
    ...style,
  };

  return (
    <div
      className={className}
      style={wrapperStyle}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
};

function buildTileMarkup(
  pipeline: PipelineOutput,
  width: number,
  height: number,
  repeats: number
): string {
  const atoms = new Map<string, ParsedAtom>();
  for (const a of pipeline.atoms) atoms.set(a.id, parseAtom(a.id, a.svg));

  const { lattice, cells } = pipeline.composition;
  const basisAMag = Math.hypot(lattice.basis_a[0], lattice.basis_a[1]);
  const worldW = Math.max(basisAMag * repeats, 1);
  const aspect = height / width;
  const worldH = worldW * aspect;

  const bounds = tileBounds(lattice, worldW, worldH);
  if (!bounds) {
    return renderFallback(atoms, cells, worldW, worldH, width, height);
  }

  const symbolDefs = [...atoms.values()]
    .map(
      (a) =>
        `<symbol id="atom-${escapeId(a.id)}" viewBox="${a.viewBox}" overflow="visible">${a.inner}</symbol>`
    )
    .join('');

  const uses: string[] = [];
  for (let i = bounds.iMin; i <= bounds.iMax; i++) {
    for (let j = bounds.jMin; j <= bounds.jMax; j++) {
      const ox = i * lattice.basis_a[0] + j * lattice.basis_b[0];
      const oy = i * lattice.basis_a[1] + j * lattice.basis_b[1];
      for (const cell of cells) {
        const atom = atoms.get(cell.atom_id);
        if (!atom) continue;
        const x = ox + cell.position[0];
        const y = oy + cell.position[1];
        const inner = cellTransformString(cell.transform, atom.width, atom.height);
        const transform = inner
          ? `translate(${x} ${y}) ${inner}`
          : `translate(${x} ${y})`;
        uses.push(
          `<use href="#atom-${escapeId(cell.atom_id)}" width="${atom.width}" height="${atom.height}" transform="${transform}" />`
        );
      }
    }
  }

  return (
    `<svg xmlns="${SVG_NS}" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${worldW} ${worldH}" preserveAspectRatio="xMidYMid slice">` +
    `<defs>${symbolDefs}</defs>${uses.join('')}</svg>`
  );
}

/**
 * Single-atom responsive render. Honors per-cell transforms (so a
 * non-identity composition cell still rotates/reflects correctly) but
 * ignores tiling — exactly one cell is drawn, scaled to fit the
 * container via viewBox.
 */
function buildSingleMarkup(pipeline: PipelineOutput): string {
  const cell = pipeline.composition.cells[0];
  if (!cell) return `<svg xmlns="${SVG_NS}"/>`;
  const rawAtom = pipeline.atoms.find((a) => a.id === cell.atom_id);
  if (!rawAtom) return `<svg xmlns="${SVG_NS}"/>`;
  const atom = parseAtom(rawAtom.id, rawAtom.svg);
  const innerTx = cellTransformString(cell.transform, atom.width, atom.height);
  const body = innerTx
    ? `<g transform="${innerTx}">${atom.inner}</g>`
    : atom.inner;
  return (
    `<svg xmlns="${SVG_NS}" width="100%" height="100%" ` +
    `viewBox="${atom.viewBox}" preserveAspectRatio="xMidYMid meet">` +
    `${body}</svg>`
  );
}

function buildCssVars(
  pipeline: PipelineOutput,
  overrides: Dict<string> | undefined
): React.CSSProperties {
  const vars: Record<string, string> = {};
  pipeline.palette.forEach((p, i) => {
    const key = `layer-${i}`;
    vars[`${LAYER_VAR_PREFIX}${i}`] = overrides?.[key] ?? p.hex;
  });
  const contourHex = pipeline.contour?.hex;
  const contourOverride = overrides?.['contour'];
  if (contourHex || contourOverride) {
    vars[CONTOUR_VAR] = contourOverride ?? contourHex ?? '#000000';
  }
  // React typing for style doesn't include CSS custom properties; the
  // shape is still valid at runtime.
  return vars as React.CSSProperties;
}

function renderFallback(
  atoms: Map<string, ParsedAtom>,
  cells: Cell[],
  worldW: number,
  worldH: number,
  width: number,
  height: number
): string {
  const symbolDefs = [...atoms.values()]
    .map(
      (a) =>
        `<symbol id="atom-${escapeId(a.id)}" viewBox="${a.viewBox}" overflow="visible">${a.inner}</symbol>`
    )
    .join('');
  const uses = cells
    .map((cell) => {
      const atom = atoms.get(cell.atom_id);
      if (!atom) return '';
      const inner = cellTransformString(cell.transform, atom.width, atom.height);
      const transform = inner
        ? `translate(${cell.position[0]} ${cell.position[1]}) ${inner}`
        : `translate(${cell.position[0]} ${cell.position[1]})`;
      return `<use href="#atom-${escapeId(cell.atom_id)}" width="${atom.width}" height="${atom.height}" transform="${transform}" />`;
    })
    .join('');
  return (
    `<svg xmlns="${SVG_NS}" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${worldW} ${worldH}" preserveAspectRatio="xMidYMid meet">` +
    `<defs>${symbolDefs}</defs>${uses}</svg>`
  );
}

function escapeId(id: string): string {
  return id.replace(/[^A-Za-z0-9_-]/g, '_');
}

export default CompositionCanvas;
