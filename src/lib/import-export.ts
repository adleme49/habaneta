// Import / export helpers for the user tile collection.
//
// Export dumps the current user tiles (NOT builtins — they already
// live in public/library.json and shipping them through the export
// would bloat the file for no reason).
//
// Import parses a JSON blob, validates each entry against the
// TileSource shape, dedupes by id against the existing collection,
// and merges the survivors in. Imported tiles are always forced to
// `source: 'user'` regardless of what the file claims, so imports
// can't accidentally overwrite builtins.

import { TileSource } from './library';
import { loadUserTiles, saveUserTiles } from './userTiles';
import { sanitizeSvg } from './svg-sanitize';

export interface ImportResult {
  added: number;
  skipped: number;
  errors: string[];
}

/** Download the current user-tile collection as a JSON file. */
export async function exportUserTiles(): Promise<number> {
  const tiles = await loadUserTiles();
  const json = JSON.stringify(tiles, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `habaneta-tiles-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
  return tiles.length;
}

/**
 * Import tiles from a user-selected JSON file. Skips duplicates by
 * id, surfaces per-entry validation errors without aborting the
 * whole import.
 */
export async function importUserTiles(file: File): Promise<ImportResult> {
  const text = await file.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('File is not valid JSON');
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Expected an array of tiles at the top level');
  }

  const existing = await loadUserTiles();
  const existingIds = new Set(existing.map((t) => t.id));

  const toAdd: TileSource[] = [];
  let skipped = 0;
  const errors: string[] = [];

  for (const raw of parsed) {
    const check = validateTileSource(raw);
    if (!check.ok) {
      errors.push(check.reason);
      continue;
    }
    if (existingIds.has(check.tile.id)) {
      skipped++;
      continue;
    }

    // If svgUrl carries an inline SVG, re-sanitize it. We can't
    // verify the file origin (JSON is arbitrary) so we treat every
    // imported payload as untrusted regardless of source.
    const sanitized = sanitizeImportedSvgUrl(check.tile.svgUrl);
    if (sanitized === null) {
      errors.push(`${check.tile.id}: rejected by sanitizer`);
      continue;
    }

    toAdd.push({ ...check.tile, svgUrl: sanitized, source: 'user' });
  }

  if (toAdd.length > 0) {
    await saveUserTiles([...existing, ...toAdd]);
  }

  return { added: toAdd.length, skipped, errors };
}

type ValidationResult =
  | { ok: true; tile: TileSource }
  | { ok: false; reason: string };

function validateTileSource(val: unknown): ValidationResult {
  if (typeof val !== 'object' || val === null) {
    return { ok: false, reason: 'Entry is not an object' };
  }
  const t = val as Record<string, unknown>;

  if (typeof t.id !== 'string') return { ok: false, reason: 'Missing id' };
  if (t.kind !== 'floor' && t.kind !== 'border') {
    return { ok: false, reason: `${t.id}: kind must be "floor" or "border"` };
  }
  if (typeof t.family !== 'string') {
    return { ok: false, reason: `${t.id}: missing family` };
  }
  if (typeof t.displayName !== 'string') {
    return { ok: false, reason: `${t.id}: missing displayName` };
  }
  if (typeof t.svgUrl !== 'string') {
    return { ok: false, reason: `${t.id}: missing svgUrl` };
  }
  if (typeof t.layers !== 'object' || t.layers === null) {
    return { ok: false, reason: `${t.id}: missing layers` };
  }
  // layers must be Dict<string> — every value a non-empty string.
  for (const [k, v] of Object.entries(t.layers as Record<string, unknown>)) {
    if (typeof v !== 'string' || v.length === 0) {
      return {
        ok: false,
        reason: `${t.id}: layer "${k}" is not a non-empty string`,
      };
    }
  }

  return { ok: true, tile: val as TileSource };
}

/**
 * Inspect an imported svgUrl. Three cases:
 *
 *   1. Path under /assets/   — trusted, passthrough
 *   2. data:image/svg+xml    — decode, run through sanitizer,
 *                              re-encode. Returns null if unsafe.
 *   3. Anything else         — null (reject: no http(s), no data URLs
 *                              with other MIME types, no file:, etc.)
 */
function sanitizeImportedSvgUrl(svgUrl: string): string | null {
  if (svgUrl.startsWith('/assets/')) return svgUrl;

  const dataMatch = svgUrl.match(
    /^data:image\/svg\+xml(?:;charset=[^,;]+)?(;base64)?,(.*)$/i
  );
  if (!dataMatch) return null;

  const isBase64 = !!dataMatch[1];
  const payload = dataMatch[2];
  let raw: string;
  try {
    raw = isBase64 ? atob(payload) : decodeURIComponent(payload);
  } catch {
    return null;
  }

  let clean: string;
  try {
    clean = sanitizeSvg(raw);
  } catch {
    return null;
  }

  return `data:image/svg+xml;utf8,${encodeURIComponent(clean)}`;
}
