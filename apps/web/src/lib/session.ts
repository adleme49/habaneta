// Session persistence: saves the user's working state (recent slots,
// floor/border selection, grid size, ambient) to localStorage so that
// refreshing the page doesn't nuke in-progress work.
//
// Only the minimal serializable state is stored — resolved tiles and
// editor buffers are re-derived on mount from the persisted instances +
// the library catalog.

import { TileInstance } from './library';
import { AmbientId } from './ambients';

const STORAGE_KEY = 'habaneta:session';

export interface SessionState {
  slots: Array<TileInstance | null>;
  floorIndex?: number;
  borderIndex?: number;
  selectedGrid?: number[];
  selectedGridPos: number;
  /** Globally selected grid pattern id (overrides per-tile grids when
   *  set). Undefined = tile-driven. See constants/floor.tsx. */
  selectedGridPatternId?: string;
  gridBodyRows: number;
  selectedAmbientId: AmbientId;
}

export function loadSession(): SessionState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.slots)) return null;
    return parsed as SessionState;
  } catch {
    return null;
  }
}

export function saveSession(state: SessionState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Quota exceeded or private browsing — fail silently.
  }
}
