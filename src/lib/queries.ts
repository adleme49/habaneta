// TanStack Query hooks for Habaneta data.
//
// Keeping these in one place so the query keys are discoverable and
// easy to invalidate from mutations (e.g. when the library admin UI
// adds a user tile, it invalidates the library key and the browser
// automatically refetches).

import { useQuery } from '@tanstack/react-query';
import { fetchBuiltinLibrary, TileSource } from './library';

export const queryKeys = {
  library: ['library'] as const,
};

export function useLibraryQuery() {
  return useQuery<TileSource[]>({
    queryKey: queryKeys.library,
    queryFn: fetchBuiltinLibrary,
    staleTime: Infinity, // catalog doesn't change during a session
  });
}
