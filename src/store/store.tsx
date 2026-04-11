import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  TileSource,
  TileInstance,
  ResolvedTile,
  FamilyMeta,
  getBuiltinLibrary,
  listFamilies,
  findSource,
  newInstance,
  paintInstanceLayer,
  resolveTile,
} from '../lib/library';
import { colors as seedColors } from '../lib/colors';
import { getNextGrid } from '../constants/floor';

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
  | { type: 'UPDATE_EDITING'; instance: TileInstance };

const initialRecent: RecentState = {
  slots: Array(RECENT_SLOT_COUNT).fill(null),
  selectedGridPos: 0,
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

    default:
      return state;
  }
}

// -------------- Store --------------

type ModalName = 'gallery' | 'enviroment' | 'save' | null;

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
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  paintLayer: (layerId: string) => void;
  commitEditingToRecent: () => void;

  // Recent slots + grid output
  recent: Array<TileInstance | null>;
  selectedFloor?: ResolvedTile;
  selectedBorder?: ResolvedTile;
  selectedGrid?: number[];
  selectRecent: (index: number) => void;
  deleteRecent: (index: number) => void;

  // UI
  modal: ModalName;
  openModal: (modal: Exclude<ModalName, null>) => void;
  closeModals: () => void;
  overlay: boolean;
  toggleOverlay: () => void;
  gridImg?: string;
  setGridImg: (img: string) => void;

  // Shared SVG sizing
  svgHeight?: number;
  setSvgHeight: (h: number) => void;
}

const StoreContext = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  // Static library, loaded once from the built-in catalog.
  const library = useMemo(() => getBuiltinLibrary(), []);
  const families = useMemo(() => listFamilies(library), [library]);

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

  // Recent slots reducer.
  const [recent, dispatch] = useReducer(recentReducer, initialRecent);

  // UI state.
  const [modal, setModal] = useState<ModalName>(null);
  const [overlay, setOverlay] = useState(false);
  const [gridImg, setGridImg] = useState<string | undefined>();
  const [svgHeight, setSvgHeight] = useState<number | undefined>();

  // Pick a tile from the browser → fresh instance loaded into editor,
  // not tied to any recent slot yet.
  const selectEditingSource = useCallback((source: TileSource) => {
    setEditingInstance(newInstance(source));
    dispatch({ type: 'DESELECT' });
  }, []);

  // Paint a single SVG layer. Updates the editor instance AND — if that
  // instance is currently backed by a recent slot — the slot too.
  const paintLayer = useCallback(
    (layerId: string) => {
      setEditingInstance((prev) => {
        if (!prev) return prev;
        const next = paintInstanceLayer(prev, layerId, selectedColor);
        if (recent.editingIndex !== undefined) {
          dispatch({ type: 'UPDATE_EDITING', instance: next });
        }
        return next;
      });
    },
    [selectedColor, recent.editingIndex]
  );

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
    },
    [recent.slots, library]
  );

  const deleteRecent = useCallback((index: number) => {
    dispatch({ type: 'DELETE', index });
  }, []);

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
    selectedColor,
    setSelectedColor,
    paintLayer,
    commitEditingToRecent,

    recent: recent.slots,
    selectedFloor,
    selectedBorder,
    selectedGrid: recent.selectedGrid,
    selectRecent,
    deleteRecent,

    modal,
    openModal: (m) => setModal(m),
    closeModals: () => setModal(null),
    overlay,
    toggleOverlay: () => setOverlay((o) => !o),
    gridImg,
    setGridImg,

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
