import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  TileSource,
  TileInstance,
  TilePreset,
  ResolvedTile,
  FamilyMeta,
  listFamilies,
  findSource,
  newInstance,
  paintInstanceLayer,
  resolveTile,
} from '../lib/library';
import {
  useDeletePresetMutation,
  useRenamePresetMutation,
  useLibraryQuery,
  usePresetsQuery,
  useSavePresetMutation,
} from '../lib/queries';
import { colors as seedColors } from '../lib/colors';
import { Ambient, AmbientId, DEFAULT_AMBIENT_ID, findAmbient } from '../lib/ambients';
import { loadSession, saveSession, SessionState } from '../lib/session';
import { DesignState } from '../lib/design-url';
import { getNextGrid, findGridPattern, GridPattern } from '../constants/floor';

/** Range for the user-controlled floor body row count. */
export const MIN_BODY_ROWS = 1;
// Raised from 6 → 20 after adding row virtualization to SimpleGrid
// and DoubleGrid. Twenty body rows is ~336 tile slots in the DOM
// when unvirtualized, which would be noticeably janky; windowed
// render keeps scrolling smooth regardless.
export const MAX_BODY_ROWS = 20;
export const DEFAULT_BODY_ROWS = 3;

// -------------- Undo/redo history for layerOverrides --------------------------

const HISTORY_CAP = 50;

interface OverrideHistory {
  /** The overrides when this tile was first loaded into the editor. */
  initial: Record<string, string>;
  /** Stack of override snapshots after each paint / reset / preset. */
  stack: Record<string, string>[];
  /** Current position in stack. -1 means "at initial". */
  cursor: number;
}

const emptyHistory: OverrideHistory = { initial: {}, stack: [], cursor: -1 };

// -------------- Recent slots (reducer for the non-trivial juggling) --------------

const RECENT_SLOT_COUNT = 7;

interface RecentState {
  /** Fixed-length array; null means "empty slot". */
  slots: Array<TileInstance | null>;
  /** Which slot is currently loaded into the editor (if any). */
  editingIndex?: number;
  /** Which slot is currently the active floor (shown on grid). */
  floorIndex?: number;
  /** Which slot is currently the active border. */
  borderIndex?: number;
  /** Chosen rotation pattern for the active floor. */
  selectedGrid?: number[];
  /** Index within floor.grids[] we're cycling through. */
  selectedGridPos: number;
}

type RecentAction =
  | { type: 'ADD'; instance: TileInstance; source: TileSource }
  | { type: 'SELECT'; index: number; source: TileSource }
  | { type: 'DESELECT' }
  | { type: 'DELETE'; index: number }
  | { type: 'UPDATE_EDITING'; instance: TileInstance }
  | { type: 'PRUNE_ORPHANS'; library: TileSource[] };

// Load any previously persisted session for initial state. Falls back
// to empty slots + defaults when nothing is saved.
const _savedSession = loadSession();

const initialRecent: RecentState = {
  slots: _savedSession?.slots ?? Array(RECENT_SLOT_COUNT).fill(null),
  floorIndex: _savedSession?.floorIndex,
  borderIndex: _savedSession?.borderIndex,
  selectedGrid: _savedSession?.selectedGrid,
  selectedGridPos: _savedSession?.selectedGridPos ?? 0,
};

/** Push a new instance into the slots array, filling empties first. */
function pushInstance(
  slots: Array<TileInstance | null>,
  instance: TileInstance
): { slots: Array<TileInstance | null>; index: number } {
  const next = [...slots];
  const emptyIdx = next.indexOf(null);
  if (emptyIdx >= 0) {
    next[emptyIdx] = instance;
    return { slots: next, index: emptyIdx };
  }
  // No empty slots — drop the oldest (slot 0), shift left, append.
  next.shift();
  next.push(instance);
  return { slots: next, index: next.length - 1 };
}

function recentReducer(state: RecentState, action: RecentAction): RecentState {
  switch (action.type) {
    case 'ADD': {
      const { slots, index } = pushInstance(state.slots, action.instance);
      if (action.source.kind === 'floor') {
        const grids = action.source.grids;
        return {
          ...state,
          slots,
          editingIndex: index,
          floorIndex: index,
          selectedGrid: grids ? grids[0] : undefined,
          selectedGridPos: 0,
        };
      }
      return {
        ...state,
        slots,
        editingIndex: index,
        borderIndex: index,
      };
    }

    case 'SELECT': {
      // Cycle through grid patterns if re-clicking the same floor slot.
      if (
        action.source.kind === 'floor' &&
        action.source.grids &&
        state.editingIndex === action.index
      ) {
        const [grid, pos] = getNextGrid(
          action.source.grids,
          state.selectedGridPos
        );
        return {
          ...state,
          editingIndex: action.index,
          floorIndex: action.index,
          selectedGrid: grid as number[],
          selectedGridPos: pos as number,
        };
      }
      if (action.source.kind === 'floor') {
        return {
          ...state,
          editingIndex: action.index,
          floorIndex: action.index,
          selectedGrid: action.source.grids ? action.source.grids[0] : undefined,
          selectedGridPos: 0,
        };
      }
      return {
        ...state,
        editingIndex: action.index,
        borderIndex: action.index,
      };
    }

    case 'DESELECT': {
      return { ...state, editingIndex: undefined };
    }

    case 'UPDATE_EDITING': {
      if (state.editingIndex === undefined) return state;
      const slots = [...state.slots];
      slots[state.editingIndex] = action.instance;
      return { ...state, slots };
    }

    case 'DELETE': {
      const slots = [...state.slots];
      slots[action.index] = null;
      const shift = (i?: number) =>
        i === action.index ? undefined : i;
      return {
        ...state,
        slots,
        editingIndex: shift(state.editingIndex),
        floorIndex: shift(state.floorIndex),
        borderIndex: shift(state.borderIndex),
      };
    }

    // After the library loads, null out any restored session slots
    // whose sourceId no longer exists (e.g. user deleted a custom
    // tile since the last session). Clear indices that pointed at
    // those now-empty slots.
    case 'PRUNE_ORPHANS': {
      const ids = new Set(action.library.map((s) => s.id));
      const slots = state.slots.map((inst) =>
        inst && ids.has(inst.sourceId) ? inst : null
      );
      const fix = (i?: number) =>
        i !== undefined && slots[i] === null ? undefined : i;
      return {
        ...state,
        slots,
        editingIndex: fix(state.editingIndex),
        floorIndex: fix(state.floorIndex),
        borderIndex: fix(state.borderIndex),
      };
    }

    default:
      return state;
  }
}

// -------------- Store --------------

type ModalName = 'gallery' | 'enviroment' | null;

export interface Store {
  // Library
  library: TileSource[];
  families: FamilyMeta[];
  colors: typeof seedColors;

  // Browsing
  selectedFamily?: FamilyMeta;
  setSelectedFamily: (family: FamilyMeta) => void;
  tilesForSelectedFamily: TileSource[];

  // Editor
  /** Instance currently loaded in the editor (from browser pick or recent slot). */
  editingInstance?: TileInstance;
  /** The ResolvedTile for the editor (source ⊕ overrides). */
  editingResolved?: ResolvedTile;
  /** Index into `recent` if the current edit came from a recent slot. */
  editingIndex?: number;

  selectEditingSource: (source: TileSource) => void;
  /** Pre-select a tile by source id — used by /home?tile=... navigation. */
  selectEditingSourceById: (sourceId: string) => boolean;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  paintLayer: (layerId: string) => void;
  commitEditingToRecent: () => void;
  /** Clear all layer overrides on the current edit, restoring defaults. */
  resetEditingTile: () => void;
  /** True when editingInstance has at least one layer override. */
  canResetEditing: boolean;

  // Undo / redo for layer overrides
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;

  // Presets — named color schemes saved per TileSource
  /** All presets (for any source) currently in storage. */
  presets: TilePreset[];
  /** Subset of `presets` matching the editingInstance's sourceId. */
  presetsForEditing: TilePreset[];
  savePreset: (name: string) => void;
  applyPreset: (preset: TilePreset) => void;
  deletePreset: (id: string) => void;
  renamePreset: (id: string, name: string) => void;

  // Recent slots + grid output
  recent: Array<TileInstance | null>;
  /** Index of the recent slot currently rendered as the floor. */
  floorIndex?: number;
  /** Index of the recent slot currently rendered as the border. */
  borderIndex?: number;
  selectedFloor?: ResolvedTile;
  selectedBorder?: ResolvedTile;
  /** Effective grid pattern angles passed to the floor renderer.
   *  Derived from selectedGridPatternId (global override) when set,
   *  else from the currently active floor tile's `grids` list. */
  selectedGrid?: number[];
  selectRecent: (index: number) => void;
  deleteRecent: (index: number) => void;

  /** Id of the globally-selected grid pattern, or undefined when
   *  "Auto" (let the tile's own grids[] drive). */
  selectedGridPatternId?: string;
  /** Set (or clear with undefined) the global grid pattern override. */
  setSelectedGridPatternId: (id: string | undefined) => void;

  // Visualization — grid size + active ambient
  /** Number of <Body /> row pairs the floor grid renders. */
  gridBodyRows: number;
  setGridBodyRows: (n: number) => void;
  /** Currently chosen ambient scene for the Environment modal. */
  selectedAmbient: Ambient;
  setSelectedAmbientId: (id: AmbientId) => void;

  // Layout — collapsible panels
  isBrowserCollapsed: boolean;
  toggleBrowserCollapsed: () => void;

  /**
   * Apply a decoded DesignState to the live store — restores
   * floor/border instances (and their layer overrides) to recent
   * slots, sets grid body rows and ambient. Used by shareable URL
   * hashes on page load.
   *
   * Returns a list of sourceIds that couldn't be resolved against
   * the current library so callers can warn the user about a
   * partial restore (e.g. a shared URL references a `user/...`
   * tile the recipient doesn't have in their IndexedDB).
   */
  applyDesign: (design: DesignState) => { missingSourceIds: string[] };

  /**
   * Snapshot the current live state as a DesignState for encoding
   * into a share URL. Returns undefined fields for anything that
   * isn't currently selected.
   */
  getCurrentDesign: () => DesignState;

  // UI
  modal: ModalName;
  openModal: (modal: Exclude<ModalName, null>) => void;
  closeModals: () => void;
  overlay: boolean;
  toggleOverlay: () => void;
  gridImg?: string;
  setGridImg: (img: string) => void;

  /**
   * True while an export/snapshot is in flight. SimpleGrid and
   * DoubleGrid bypass row virtualization when this is set so the
   * captured PNG contains every row, not just the ones currently
   * in the scroll viewport.
   */
  isExporting: boolean;
  setIsExporting: (v: boolean) => void;

  // Shared SVG sizing
  svgHeight?: number;
  setSvgHeight: (h: number) => void;
}

const StoreContext = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  // Library loaded async via TanStack Query. The whole app is gated on
  // a successful load — rendering a loading/error shell until the
  // catalog is ready keeps the downstream components simple (they can
  // assume `library` is a populated TileSource[]).
  const { t } = useTranslation();
  const libraryQuery = useLibraryQuery();

  if (libraryQuery.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">
        {t('library.loading')}
      </div>
    );
  }
  if (libraryQuery.isError || !libraryQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-red-600">
        {t('library.failed', { error: String(libraryQuery.error) })}
      </div>
    );
  }

  return <StoreProviderInner library={libraryQuery.data}>{children}</StoreProviderInner>;
};

const StoreProviderInner: React.FC<{
  library: TileSource[];
  children?: React.ReactNode;
}> = ({ library, children }) => {
  const families = useMemo(() => listFamilies(library), [library]);

  // Presets query + mutations (backed by localStorage).
  const presetsQuery = usePresetsQuery();
  const savePresetMutation = useSavePresetMutation();
  const deletePresetMutation = useDeletePresetMutation();
  const renamePresetMutation = useRenamePresetMutation();
  const presets = presetsQuery.data ?? [];

  // Browsing
  const [selectedFamily, setSelectedFamily] = useState<FamilyMeta | undefined>();
  const tilesForSelectedFamily = useMemo(
    () =>
      selectedFamily
        ? library.filter(
            (t) => t.family === selectedFamily.name && t.kind === selectedFamily.kind
          )
        : [],
    [library, selectedFamily]
  );

  // Editor — an instance that's not (yet) in recent.
  const [editingInstance, setEditingInstance] = useState<TileInstance | undefined>();
  const [selectedColor, setSelectedColor] = useState<string>('#ffffff');

  // ---- Undo/redo history for layerOverrides ----
  const [history, setHistory] = useState<OverrideHistory>(emptyHistory);

  const resetHistory = useCallback(
    (overrides: Record<string, string>) =>
      setHistory({ initial: { ...overrides }, stack: [], cursor: -1 }),
    []
  );

  const pushHistory = useCallback(
    (overrides: Record<string, string>) =>
      setHistory((h) => {
        // Truncate any forward entries past cursor, then append.
        const base = h.stack.slice(0, h.cursor + 1);
        base.push({ ...overrides });
        // Cap to prevent unbounded growth.
        if (base.length > HISTORY_CAP) base.shift();
        return { ...h, stack: base, cursor: base.length - 1 };
      }),
    []
  );

  const canUndo = history.cursor >= 0;
  const canRedo = history.cursor < history.stack.length - 1;

  // Recent slots reducer.
  const [recent, dispatch] = useReducer(recentReducer, initialRecent);

  // On first mount, prune any restored session slots whose sourceId
  // is no longer in the library (e.g. the user deleted a custom tile
  // since the last session was saved). This must run after the library
  // is available — StoreProviderInner only mounts once the library
  // query has resolved, so `library` is guaranteed to be populated.
  const prunedRef = React.useRef(false);
  useEffect(() => {
    if (prunedRef.current) return;
    prunedRef.current = true;
    dispatch({ type: 'PRUNE_ORPHANS', library });
  }, [library]);

  // UI state.
  const [modal, setModal] = useState<ModalName>(null);
  const [overlay, setOverlay] = useState(false);
  const [gridImg, setGridImg] = useState<string | undefined>();
  const [isExporting, setIsExporting] = useState(false);
  const [svgHeight, setSvgHeight] = useState<number | undefined>();

  // Visualization state — restored from the saved session when present.
  const [gridBodyRows, setGridBodyRowsState] = useState<number>(
    _savedSession?.gridBodyRows ?? DEFAULT_BODY_ROWS
  );
  const setGridBodyRows = useCallback((n: number) => {
    // Clamp to the documented range so stray callers can't blow up
    // the render loop with a 10,000-row grid.
    const clamped = Math.max(MIN_BODY_ROWS, Math.min(MAX_BODY_ROWS, Math.round(n)));
    setGridBodyRowsState(clamped);
  }, []);

  const [selectedAmbientId, setSelectedAmbientId] =
    useState<AmbientId>(_savedSession?.selectedAmbientId ?? DEFAULT_AMBIENT_ID);
  const selectedAmbient = useMemo(
    () => findAmbient(selectedAmbientId),
    [selectedAmbientId]
  );

  // Global grid-pattern override. When set, the floor renders this
  // pattern regardless of what the currently selected floor tile's
  // `grids` list contained. Undefined = tile-driven (legacy behavior).
  const [selectedGridPatternId, setSelectedGridPatternId] = useState<
    string | undefined
  >(_savedSession?.selectedGridPatternId);

  // Effective grid passed to the renderer: the override's angles when
  // a pattern is explicitly picked; otherwise the per-tile cycling
  // array maintained by the recent reducer.
  const effectiveGrid = useMemo<number[] | undefined>(() => {
    if (selectedGridPatternId) {
      const p: GridPattern | undefined = findGridPattern(selectedGridPatternId);
      if (p) return [...p.angles];
    }
    return recent.selectedGrid;
  }, [selectedGridPatternId, recent.selectedGrid]);

  const [isBrowserCollapsed, setIsBrowserCollapsed] = useState<boolean>(false);
  const toggleBrowserCollapsed = useCallback(
    () => setIsBrowserCollapsed((c) => !c),
    []
  );

  // --- Session persistence ---
  // Write to localStorage whenever the working state changes so a
  // page refresh doesn't discard the user's in-progress design.
  useEffect(() => {
    const session: SessionState = {
      slots: recent.slots,
      floorIndex: recent.floorIndex,
      borderIndex: recent.borderIndex,
      selectedGrid: recent.selectedGrid,
      selectedGridPos: recent.selectedGridPos,
      selectedGridPatternId,
      gridBodyRows,
      selectedAmbientId,
    };
    saveSession(session);
  }, [recent, selectedGridPatternId, gridBodyRows, selectedAmbientId]);

  // Apply a decoded DesignState to the store. Commits each instance
  // as a new recent slot (so it stays editable) and sets the
  // visualization knobs. Returns the list of sourceIds we couldn't
  // find in the library so the caller can warn the user about a
  // partial restore.
  const applyDesign = useCallback(
    (design: DesignState) => {
      const missingSourceIds: string[] = [];
      if (design.floor) {
        const source = findSource(library, design.floor.sourceId);
        if (source) {
          dispatch({ type: 'ADD', instance: design.floor, source });
        } else {
          missingSourceIds.push(design.floor.sourceId);
        }
      }
      if (design.border) {
        const source = findSource(library, design.border.sourceId);
        if (source) {
          dispatch({ type: 'ADD', instance: design.border, source });
        } else {
          missingSourceIds.push(design.border.sourceId);
        }
      }
      if (design.gridBodyRows !== undefined) {
        setGridBodyRows(design.gridBodyRows);
      }
      if (design.selectedAmbientId) {
        setSelectedAmbientId(design.selectedAmbientId);
      }
      // Only accept pattern ids that exist in the registry; unknown
      // ids (older/newer client) silently fall back to tile-driven.
      if (design.selectedGridPatternId) {
        if (findGridPattern(design.selectedGridPatternId)) {
          setSelectedGridPatternId(design.selectedGridPatternId);
        }
      }
      return { missingSourceIds };
    },
    [library, setGridBodyRows, setSelectedAmbientId]
  );

  // Pick a tile from the browser → fresh instance loaded into editor,
  // not tied to any recent slot yet. Also sets selectedFamily so the
  // browser panel reflects where the tile came from.
  const selectEditingSource = useCallback(
    (source: TileSource) => {
      const inst = newInstance(source);
      setEditingInstance(inst);
      resetHistory(inst.layerOverrides);
      dispatch({ type: 'DESELECT' });
      setSelectedFamily({
        name: source.family,
        kind: source.kind,
        count: library.filter(
          (t) => t.family === source.family && t.kind === source.kind
        ).length,
      });
    },
    [library, resetHistory]
  );

  // Look up a tile by id and load it into the editor. Returns false
  // if the id isn't in the library (e.g. stale URL after delete).
  const selectEditingSourceById = useCallback(
    (sourceId: string): boolean => {
      const source = findSource(library, sourceId);
      if (!source) return false;
      selectEditingSource(source);
      return true;
    },
    [library, selectEditingSource]
  );

  // Paint a single SVG layer. Updates the editor instance AND — if that
  // instance is currently backed by a recent slot — the slot too.
  // Pushes the new overrides onto the undo history.
  const paintLayer = useCallback(
    (layerId: string) => {
      setEditingInstance((prev) => {
        if (!prev) return prev;
        const next = paintInstanceLayer(prev, layerId, selectedColor);
        pushHistory(next.layerOverrides);
        if (recent.editingIndex !== undefined) {
          dispatch({ type: 'UPDATE_EDITING', instance: next });
        }
        return next;
      });
    },
    [selectedColor, recent.editingIndex, pushHistory]
  );

  // Clear layer overrides on the current edit — restore the source defaults.
  // If the edit is backed by a recent slot, the slot syncs via UPDATE_EDITING.
  // Pushed onto the history stack so the user can undo the reset.
  const resetEditingTile = useCallback(() => {
    setEditingInstance((prev) => {
      if (!prev) return prev;
      const next: TileInstance = { ...prev, layerOverrides: {} };
      pushHistory(next.layerOverrides);
      if (recent.editingIndex !== undefined) {
        dispatch({ type: 'UPDATE_EDITING', instance: next });
      }
      return next;
    });
  }, [recent.editingIndex, pushHistory]);

  // Undo: step back one entry in the override history.
  const undo = useCallback(() => {
    setHistory((h) => {
      if (h.cursor < 0) return h; // nothing to undo
      const newCursor = h.cursor - 1;
      const overrides = newCursor < 0 ? h.initial : h.stack[newCursor];
      setEditingInstance((prev) => {
        if (!prev) return prev;
        const next: TileInstance = { ...prev, layerOverrides: { ...overrides } };
        if (recent.editingIndex !== undefined) {
          dispatch({ type: 'UPDATE_EDITING', instance: next });
        }
        return next;
      });
      return { ...h, cursor: newCursor };
    });
  }, [recent.editingIndex]);

  // Redo: step forward one entry in the override history.
  const redo = useCallback(() => {
    setHistory((h) => {
      if (h.cursor >= h.stack.length - 1) return h; // nothing to redo
      const newCursor = h.cursor + 1;
      const overrides = h.stack[newCursor];
      setEditingInstance((prev) => {
        if (!prev) return prev;
        const next: TileInstance = { ...prev, layerOverrides: { ...overrides } };
        if (recent.editingIndex !== undefined) {
          dispatch({ type: 'UPDATE_EDITING', instance: next });
        }
        return next;
      });
      return { ...h, cursor: newCursor };
    });
  }, [recent.editingIndex]);

  // Ctrl+Z / Ctrl+Y (Cmd on Mac) keyboard shortcuts for undo/redo.
  // Guarded against <input>/<textarea> targets so typing in a hex
  // color or preset name field still gets native browser undo.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [undo, redo]);

  // "Salvar a recientes" — commit the current editor instance to a slot.
  const commitEditingToRecent = useCallback(() => {
    if (!editingInstance) return;
    const source = findSource(library, editingInstance.sourceId);
    if (!source) return;
    dispatch({ type: 'ADD', instance: editingInstance, source });
  }, [editingInstance, library]);

  // Click an existing recent slot → load it into the editor.
  const selectRecent = useCallback(
    (index: number) => {
      const instance = recent.slots[index];
      if (!instance) return;
      const source = findSource(library, instance.sourceId);
      if (!source) return;
      dispatch({ type: 'SELECT', index, source });
      setEditingInstance(instance);
      resetHistory(instance.layerOverrides);
    },
    [recent.slots, library, resetHistory]
  );

  const deleteRecent = useCallback((index: number) => {
    dispatch({ type: 'DELETE', index });
  }, []);

  // ----- Preset actions -----

  const savePreset = useCallback(
    (name: string) => {
      if (!editingInstance) return;
      const trimmed = name.trim();
      if (!trimmed) return;
      const preset: TilePreset = {
        id: `${editingInstance.sourceId}:${Date.now()}`,
        sourceId: editingInstance.sourceId,
        name: trimmed,
        layerOverrides: { ...editingInstance.layerOverrides },
        createdAt: new Date().toISOString(),
      };
      savePresetMutation.mutate(preset);
    },
    [editingInstance, savePresetMutation]
  );

  const applyPreset = useCallback(
    (preset: TilePreset) => {
      setEditingInstance((prev) => {
        if (!prev || prev.sourceId !== preset.sourceId) return prev;
        const next: TileInstance = {
          ...prev,
          layerOverrides: { ...preset.layerOverrides },
        };
        pushHistory(next.layerOverrides);
        if (recent.editingIndex !== undefined) {
          dispatch({ type: 'UPDATE_EDITING', instance: next });
        }
        return next;
      });
    },
    [recent.editingIndex, pushHistory]
  );

  const renamePresetCb = useCallback(
    (id: string, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      renamePresetMutation.mutate({ id, name: trimmed });
    },
    [renamePresetMutation]
  );

  const deletePreset = useCallback(
    (id: string) => {
      deletePresetMutation.mutate(id);
    },
    [deletePresetMutation]
  );

  const presetsForEditing = useMemo(
    () =>
      editingInstance
        ? presets.filter((p) => p.sourceId === editingInstance.sourceId)
        : [],
    [presets, editingInstance]
  );

  // ----- Derived resolved tiles -----

  const resolveByIndex = useCallback(
    (index?: number): ResolvedTile | undefined => {
      if (index === undefined) return undefined;
      const instance = recent.slots[index];
      if (!instance) return undefined;
      const source = findSource(library, instance.sourceId);
      if (!source) return undefined;
      return resolveTile(source, instance);
    },
    [library, recent.slots]
  );

  const selectedFloor = useMemo(
    () => resolveByIndex(recent.floorIndex),
    [resolveByIndex, recent.floorIndex]
  );

  const selectedBorder = useMemo(
    () => resolveByIndex(recent.borderIndex),
    [resolveByIndex, recent.borderIndex]
  );

  const editingResolved = useMemo<ResolvedTile | undefined>(() => {
    if (!editingInstance) return undefined;
    const source = findSource(library, editingInstance.sourceId);
    if (!source) return undefined;
    return resolveTile(source, editingInstance);
  }, [library, editingInstance]);

  // Snapshot the live store into a DesignState for URL encoding.
  // Pulls the floor / border instances out of the recent slots
  // (where they're committed) rather than from the editor buffer,
  // so "Share" always reflects what's actually on the grid.
  const getCurrentDesign = useCallback((): DesignState => {
    const floorInstance =
      recent.floorIndex !== undefined
        ? recent.slots[recent.floorIndex] ?? undefined
        : undefined;
    const borderInstance =
      recent.borderIndex !== undefined
        ? recent.slots[recent.borderIndex] ?? undefined
        : undefined;
    return {
      floor: floorInstance ?? undefined,
      border: borderInstance ?? undefined,
      gridBodyRows,
      selectedAmbientId: selectedAmbient.id,
      selectedGridPatternId,
    };
  }, [recent.floorIndex, recent.borderIndex, recent.slots, gridBodyRows, selectedAmbient.id, selectedGridPatternId]);

  const value: Store = {
    library,
    families,
    colors: seedColors,

    selectedFamily,
    setSelectedFamily,
    tilesForSelectedFamily,

    editingInstance,
    editingResolved,
    editingIndex: recent.editingIndex,
    selectEditingSource,
    selectEditingSourceById,
    selectedColor,
    setSelectedColor,
    paintLayer,
    commitEditingToRecent,
    resetEditingTile,
    canResetEditing:
      !!editingInstance &&
      Object.keys(editingInstance.layerOverrides).length > 0,

    undo,
    redo,
    canUndo,
    canRedo,

    presets,
    presetsForEditing,
    savePreset,
    applyPreset,
    deletePreset,
    renamePreset: renamePresetCb,

    recent: recent.slots,
    floorIndex: recent.floorIndex,
    borderIndex: recent.borderIndex,
    selectedFloor,
    selectedBorder,
    selectedGrid: effectiveGrid,
    selectRecent,
    deleteRecent,

    selectedGridPatternId,
    setSelectedGridPatternId,

    gridBodyRows,
    setGridBodyRows,
    selectedAmbient,
    setSelectedAmbientId,

    isBrowserCollapsed,
    toggleBrowserCollapsed,

    applyDesign,
    getCurrentDesign,

    modal,
    openModal: (m) => setModal(m),
    closeModals: () => setModal(null),
    overlay,
    toggleOverlay: () => setOverlay((o) => !o),
    gridImg,
    setGridImg,
    isExporting,
    setIsExporting,

    svgHeight,
    setSvgHeight,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within a StoreProvider');
  return store;
}
