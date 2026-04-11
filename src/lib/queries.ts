// TanStack Query hooks for Habaneta data.
//
// Keeping these in one place so the query keys are discoverable and
// easy to invalidate from mutations (e.g. when the library admin UI
// adds a user tile, it invalidates the library key and the browser
// automatically refetches).

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { fetchBuiltinLibrary, TileSource, TilePreset } from './library';
import { addPreset, loadPresets, removePreset } from './presets';

export const queryKeys = {
  library: ['library'] as const,
  presets: ['presets'] as const,
};

// ---------- Library (built-in catalog) ----------

export function useLibraryQuery() {
  return useQuery<TileSource[]>({
    queryKey: queryKeys.library,
    queryFn: fetchBuiltinLibrary,
    staleTime: Infinity, // catalog doesn't change during a session
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
    onSuccess: (next) => {
      qc.setQueryData(queryKeys.presets, next);
    },
  });
}

export function useDeletePresetMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => removePreset(id),
    onSuccess: (next) => {
      qc.setQueryData(queryKeys.presets, next);
    },
  });
}
