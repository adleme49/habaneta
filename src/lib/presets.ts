// Persistence for user-saved tile presets.
//
// Presets are named color schemes keyed to a specific TileSource.
// Stored in localStorage under one JSON array so the whole set can be
// imported/exported as a single blob.
//
// We deliberately put the storage layer behind plain functions rather
// than inlining localStorage calls in components — this lets the
// queries.ts layer wrap them in useQuery / useMutation without the
// components ever touching localStorage directly. Swapping the
// backing store (e.g. for IndexedDB later, or a real backend) is a
// one-file change.

import { TilePreset } from './library';

const STORAGE_KEY = 'habaneta:presets';

/** Read all presets from localStorage. Returns [] on empty/invalid. */
export function loadPresets(): TilePreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TilePreset[]) : [];
  } catch {
    return [];
  }
}

/** Overwrite the entire preset collection. */
function savePresets(presets: TilePreset[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

/** Append a new preset. Returns the full updated collection. */
export function addPreset(preset: TilePreset): TilePreset[] {
  const next = [...loadPresets(), preset];
  savePresets(next);
  return next;
}

/** Remove a preset by id. Returns the full updated collection. */
export function removePreset(id: string): TilePreset[] {
  const next = loadPresets().filter((p) => p.id !== id);
  savePresets(next);
  return next;
}
