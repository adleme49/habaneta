// Persistence for user-uploaded tiles.
//
// Stored in IndexedDB (via idb-keyval) under one key holding the full
// array. The shape is identical to builtin TileSources but with
// `source: 'user'` and locally-generated IDs; TileInstance and
// ResolvedTile logic works on them without modification.
//
// Keeping the storage layer behind these plain functions lets the
// queries.ts layer wrap them in useQuery / useMutation without the
// components ever touching IndexedDB directly. Swapping to a real
// backend later is a one-file change.

import { get, set } from 'idb-keyval';
import { TileSource } from './library';

const STORAGE_KEY = 'habaneta:user-tiles';

/** Read all user-uploaded tiles. Returns [] on empty/missing/invalid. */
export async function loadUserTiles(): Promise<TileSource[]> {
  try {
    const value = await get<TileSource[]>(STORAGE_KEY);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

/** Overwrite the entire user-tile collection. */
async function saveUserTiles(tiles: TileSource[]): Promise<void> {
  await set(STORAGE_KEY, tiles);
}

/** Append a new user tile. Returns the full updated collection. */
export async function addUserTile(tile: TileSource): Promise<TileSource[]> {
  const current = await loadUserTiles();
  const next = [...current, tile];
  await saveUserTiles(next);
  return next;
}

/** Remove a user tile by id. Returns the full updated collection. */
export async function removeUserTile(id: string): Promise<TileSource[]> {
  const current = await loadUserTiles();
  const next = current.filter((t) => t.id !== id);
  await saveUserTiles(next);
  return next;
}
