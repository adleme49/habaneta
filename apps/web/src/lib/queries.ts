// TanStack Query hooks for Habaneta data.
//
// Keeping these in one place so the query keys are discoverable and
// easy to invalidate from mutations — mutations update the same
// query cache used by hooks everywhere in the app, so writing a new
// pattern or preset shows up instantly wherever the data is read.

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchLibrary, TileSource, TilePreset } from './library';
import {
  addPreset,
  loadPresets,
  removePreset,
  renamePreset,
} from './presets';
import { addUserTile, removeUserTile } from './userTiles';
import {
  deletePattern,
  uploadAndSavePattern,
  type NewPattern,
} from './patternsApi';

export const queryKeys = {
  library: ['library'] as const,
  presets: ['presets'] as const,
};

// ---------- Library (builtin tiles + cloud-saved patterns) ----------

export function useLibraryQuery() {
  return useQuery<TileSource[]>({
    queryKey: queryKeys.library,
    queryFn: fetchLibrary,
    // Builtins don't change during a session; cloud patterns refetch
    // happens via explicit invalidation from the save / delete
    // mutations below.
    staleTime: Infinity,
  });
}

/**
 * Save a freshly-imported pattern to the cloud. Wraps the three-step
 * dance (presign R2 → PUT photo → POST /v1/patterns) so callers
 * just hand over the photo file + the pipeline output + metadata.
 */
export interface SavePatternInput {
  file: File;
  body: Omit<NewPattern, 'photo_key'>;
}

export function useSavePatternMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, body }: SavePatternInput) =>
      uploadAndSavePattern(file, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.library });
    },
  });
}

export function useDeletePatternMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (sourceId: string) => {
      // Library uses `pattern/<uuid>` ids; strip the prefix for the API.
      const id = sourceId.startsWith('pattern/')
        ? sourceId.slice('pattern/'.length)
        : sourceId;
      await deletePattern(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.library });
    },
  });
}

// ---------- Legacy IndexedDB-backed tiles ----------
//
// Kept for `TileUploadDialog` (hand-crafted SVG uploads, no photo)
// and for the JSON bundle import/export flow. Cloud patterns live in
// the API; these continue to live device-side.

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
    mutationFn: async (id: string) => {
      // For cloud patterns, route to the API; for IDB tiles, hit the
      // local store. Distinguished by id prefix.
      if (id.startsWith('pattern/')) {
        await deletePattern(id.slice('pattern/'.length));
      } else {
        await removeUserTile(id);
      }
    },
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
    // the UI never flashes stale data.
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

export function useRenamePresetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) =>
      renamePreset(id, name),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.presets, updated);
    },
  });
}
