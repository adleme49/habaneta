// TanStack Query hooks for Habaneta data.
//
// Keeping these in one place so the query keys are discoverable and
// easy to invalidate from mutations — mutations update the same
// query cache used by hooks everywhere in the app, so writing a new
// tile or preset shows up instantly wherever the data is read.

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchLibrary, TileSource, TilePreset } from './library';
import { addPreset, loadPresets, removePreset } from './presets';
import { addUserTile, removeUserTile } from './userTiles';

export const queryKeys = {
  library: ['library'] as const,
  presets: ['presets'] as const,
};

// ---------- Library (builtin + user tiles) ----------

export function useLibraryQuery() {
  return useQuery<TileSource[]>({
    queryKey: queryKeys.library,
    queryFn: fetchLibrary,
    // The builtin half doesn't change during a session; refetches
    // happen via explicit invalidation from user-tile mutations.
    staleTime: Infinity,
  });
}

export function useSaveUserTileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (tile: TileSource) => addUserTile(tile),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.library });
    },
  });
}

export function useDeleteUserTileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => removeUserTile(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.library });
    },
  });
}

// ---------- Presets (user-saved color schemes) ----------

export function usePresetsQuery() {
  return useQuery<TilePreset[]>({
    queryKey: queryKeys.presets,
    // loadPresets is sync, but wrapping it in useQuery gives us a
    // single source of truth + cache invalidation when mutations run.
    queryFn: async () => loadPresets(),
    staleTime: Infinity,
  });
}

export function useSavePresetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (preset: TilePreset) => addPreset(preset),
    // addPreset / removePreset are synchronous localStorage writes
    // that return the full updated array. setQueryData applies the
    // new snapshot to the cache immediately (same render frame) so
    // the UI never flashes stale data. The old invalidateQueries
    // approach was async — between the mutation completing and the
    // refetch landing, the cache still held the previous snapshot.
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.presets, updated);
    },
  });
}

export function useDeletePresetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => removePreset(id),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.presets, updated);
    },
  });
}
