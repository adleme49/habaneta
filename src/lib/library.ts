// Library data model.
//
// Three concepts, deliberately separated:
//
//   TileSource    — immutable catalog entry (svg path + default layer colors)
//   TileInstance  — a user's customization (source id + layer overrides)
//   ResolvedTile  — source ⊕ instance, ready for the SVG renderer
//
// The legacy code conflated these: clicking a tile mutated the source's
// `layers` object in place, so the original defaults were lost until a
// full page reload. Splitting the concepts lets us implement reset,
// undo/redo, persist user instances separately from the catalog, and
// eventually load the catalog from JSON or a backend without rewriting
// the rendering path.

import libraryJson from '../../public/library.json';
import { ITile, Dict } from '../context/interfaces';

export type TileKind = 'floor' | 'border';

export interface TileSource {
  id: string;                      // stable slug, e.g. "contemporary/l05"
  kind: TileKind;
  family: string;                  // family display name, e.g. "Contemporary"
  displayName: string;             // "Mod. l05"
  svgUrl: string;                  // primary SVG path (relative to index.html)
  cornerUrl?: string;              // border variants
  cornerInteriorUrl?: string;
  layers: Dict<string>;            // default colors by layer id (st0, st1...)
  grids?: number[][];              // floor rotation patterns
  tags?: string[];
  source: 'builtin' | 'user';
}

export interface TileInstance {
  sourceId: string;
  layerOverrides: Dict<string>;    // only the layers the user has changed
}

/**
 * A TileSource merged with a TileInstance's overrides. Shape-compatible
 * with the legacy ITile / IFloor / IBorder union so existing rendering
 * components (SVGBase, SVGTile, grid sub-components) can consume it
 * without changes.
 */
export interface ResolvedTile extends ITile {
  _sourceId: string;
  layers: Dict<string>;
  cornerUrl?: string;
  cornerInteriorUrl?: string;
  grids?: number[][];
}

/** Build an empty TileInstance for a freshly-picked source. */
export function newInstance(source: TileSource): TileInstance {
  return { sourceId: source.id, layerOverrides: {} };
}

/** Merge a source with an instance's overrides into a render-ready tile. */
export function resolveTile(
  source: TileSource,
  instance: TileInstance
): ResolvedTile {
  return {
    name: source.displayName,
    type: source.kind === 'floor' ? 'Floor' : 'Border',
    imgUrl: source.svgUrl,
    cornerUrl: source.cornerUrl,
    cornerInteriorUrl: source.cornerInteriorUrl,
    layers: { ...source.layers, ...instance.layerOverrides },
    grids: source.grids,
    _sourceId: source.id,
  };
}

/**
 * Paint a single layer on an instance. Returns a new instance with the
 * layer override updated. Does not mutate either argument.
 */
export function paintInstanceLayer(
  instance: TileInstance,
  layerId: string,
  color: string
): TileInstance {
  return {
    ...instance,
    layerOverrides: { ...instance.layerOverrides, [layerId]: color },
  };
}

// ---------- Static catalog loading ----------

/**
 * Load the built-in tile catalog. Today this is a synchronous import
 * of public/library.json; the next step wraps it in TanStack Query so
 * user-uploaded tiles (from IndexedDB) can be merged in at runtime.
 */
export function getBuiltinLibrary(): TileSource[] {
  return libraryJson as TileSource[];
}

/** List of all family names that contain at least one tile, grouped by kind. */
export interface FamilyMeta {
  name: string;
  kind: TileKind;
  count: number;
}

export function listFamilies(library: TileSource[]): FamilyMeta[] {
  const map = new Map<string, FamilyMeta>();
  for (const t of library) {
    const key = `${t.kind}:${t.family}`;
    const existing = map.get(key);
    if (existing) existing.count++;
    else map.set(key, { name: t.family, kind: t.kind, count: 1 });
  }
  return [...map.values()];
}

/** Find a TileSource by id in a library. */
export function findSource(
  library: TileSource[],
  sourceId: string
): TileSource | undefined {
  return library.find((t) => t.id === sourceId);
}
