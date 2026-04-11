import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from 'react';
import {
  IBorder,
  IFamily,
  IFloor,
  ITile,
} from '../context/interfaces';
import {
  borderFam,
  colors as seedColors,
  tilesFam,
  recent as seedRecent,
} from '../context/seed';
import { getNextGrid } from '../constants/floor';

// -------------- Recent state (uses reducer for non-trivial mutations) --------------

interface RecentState {
  recent: ITile[];
  count: number;
  selectedTileIndex?: number;
  selectedFloorIndex?: number;
  selectedBorderIndex?: number;
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedGrid?: number[];
  selectedGridPos: number;
}

type RecentAction =
  | { type: 'ADD'; tile: ITile }
  | { type: 'SELECT'; index: number }
  | { type: 'DELETE'; index: number }
  | { type: 'UPDATE_SELECTED'; tile: ITile };

const initialRecent: RecentState = {
  recent: seedRecent as ITile[],
  count: 0,
  selectedGridPos: 0,
};

function recentReducer(state: RecentState, action: RecentAction): RecentState {
  switch (action.type) {
    case 'ADD': {
      const tile = action.tile;
      const empty: ITile[] = [];
      const recents: ITile[] = [];
      state.recent.forEach((current) => {
        if (current.name === 'empty') empty.push(current);
        else recents.push(current);
      });
      if (empty.length > 0) {
        empty.push(tile);
        empty.shift();
        empty.reverse();
      } else {
        recents.shift();
        recents.push(tile);
      }
      const recent = [...recents, ...empty];
      const count = state.count + 1;
      if (tile.type === 'Floor') {
        const floor = tile as IFloor;
        return {
          ...state,
          recent,
          count,
          selectedGrid: floor.grids ? floor.grids[0] : undefined,
          selectedGridPos: 0,
          selectedFloor: floor,
          selectedFloorIndex: count - 1,
          selectedTileIndex: count - 1,
        };
      }
      return {
        ...state,
        recent,
        count,
        selectedBorder: tile as IBorder,
        selectedBorderIndex: count - 1,
        selectedTileIndex: count - 1,
      };
    }
    case 'SELECT': {
      const tile = state.recent[action.index];
      const selectedTileIndex = action.index;
      if (tile.type === 'Floor') {
        const floor = tile as IFloor;
        if (floor.grids && selectedTileIndex === state.selectedTileIndex) {
          const [newGrid, newPos] = getNextGrid(floor.grids, state.selectedGridPos);
          return {
            ...state,
            selectedGrid: newGrid as number[],
            selectedGridPos: newPos as number,
            selectedTileIndex,
            selectedFloor: floor,
            selectedFloorIndex: action.index,
          };
        }
        return {
          ...state,
          selectedGrid: floor.grids ? floor.grids[0] : undefined,
          selectedGridPos: 0,
          selectedTileIndex,
          selectedFloor: floor,
          selectedFloorIndex: action.index,
        };
      }
      return {
        ...state,
        selectedTileIndex,
        selectedBorder: tile as IBorder,
        selectedBorderIndex: action.index,
      };
    }
    case 'UPDATE_SELECTED': {
      if (state.selectedTileIndex === undefined) return state;
      const recentCopy = [...state.recent];
      recentCopy[state.selectedTileIndex] = action.tile;
      if (state.selectedTileIndex === state.selectedBorderIndex) {
        return { ...state, recent: recentCopy, selectedBorder: action.tile as IBorder };
      }
      return { ...state, recent: recentCopy, selectedFloor: action.tile as IFloor };
    }
    case 'DELETE': {
      const index = action.index;
      const recent = [
        ...state.recent.filter((_, i) => i !== index),
        { name: 'empty' } as ITile,
      ];
      const count = state.count - 1;
      const shift = (i?: number) =>
        i !== undefined && i > index ? i - 1 : i;
      const selectedTileIndex =
        state.selectedTileIndex === index ? undefined : shift(state.selectedTileIndex);
      const selectedFloorIndex = shift(state.selectedFloorIndex);
      const selectedBorderIndex = shift(state.selectedBorderIndex);
      if (index === state.selectedBorderIndex) {
        return {
          ...state,
          recent,
          count,
          selectedTileIndex,
          selectedBorder: undefined,
          selectedBorderIndex: undefined,
          selectedFloorIndex,
        };
      }
      if (index === state.selectedFloorIndex) {
        return {
          ...state,
          recent,
          count,
          selectedTileIndex,
          selectedFloor: undefined,
          selectedFloorIndex: undefined,
          selectedBorderIndex,
        };
      }
      return {
        ...state,
        recent,
        count,
        selectedTileIndex,
        selectedFloorIndex,
        selectedBorderIndex,
      };
    }
    default:
      return state;
  }
}

// -------------- Store --------------

type ModalName = 'gallery' | 'enviroment' | 'save' | null;

export interface Store {
  // Static seed data
  tilesFamilys: typeof tilesFam;
  borderFamilys: typeof borderFam;
  colors: typeof seedColors;

  // Browser
  selectedFamily?: IFamily;
  setSelectedFamily: (family: IFamily) => void;

  // Editor
  editingTile?: ITile;
  selectEditingTile: (tile: ITile) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  paintLayer: (layerId: string) => void;

  // Recent / grid output
  recent: ITile[];
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedGrid?: number[];
  selectedTileIndex?: number;
  addRecent: (tile: ITile) => void;
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
  setSvgHeight: (height: number) => void;
}

const StoreContext = createContext<Store | null>(null);

export const StoreProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<IFamily | undefined>();
  const [editingTile, setEditingTile] = useState<ITile | undefined>();
  const [selectedColor, setSelectedColor] = useState<string>('white');
  const [recentState, dispatch] = useReducer(recentReducer, initialRecent);
  const [modal, setModal] = useState<ModalName>(null);
  const [overlay, setOverlay] = useState(false);
  const [gridImg, setGridImg] = useState<string | undefined>();
  const [svgHeight, setSvgHeight] = useState<number | undefined>();

  // Pick a tile from the browser into the editor (new tile, not from recent)
  const selectEditingTile = useCallback((tile: ITile) => {
    setEditingTile({ ...tile, type: selectedFamily?.type });
  }, [selectedFamily]);

  // Paint a layer with the selected color (updates editor + recent if applicable)
  const paintLayer = useCallback(
    (layerId: string) => {
      setEditingTile((prev) => {
        if (!prev) return prev;
        const next: ITile = {
          ...prev,
          layers: { ...prev.layers, [layerId]: selectedColor },
        };
        if (recentState.selectedTileIndex !== undefined) {
          dispatch({ type: 'UPDATE_SELECTED', tile: next });
        }
        return next;
      });
    },
    [selectedColor, recentState.selectedTileIndex]
  );

  // Select a recent slot → load into editor
  const selectRecent = useCallback(
    (index: number) => {
      dispatch({ type: 'SELECT', index });
      setEditingTile(recentState.recent[index]);
    },
    [recentState.recent]
  );

  const addRecent = useCallback((tile: ITile) => {
    dispatch({ type: 'ADD', tile });
  }, []);

  const deleteRecent = useCallback((index: number) => {
    dispatch({ type: 'DELETE', index });
  }, []);

  const value: Store = {
    tilesFamilys: tilesFam,
    borderFamilys: borderFam,
    colors: seedColors,

    selectedFamily,
    setSelectedFamily,

    editingTile,
    selectEditingTile,
    selectedColor,
    setSelectedColor,
    paintLayer,

    recent: recentState.recent,
    selectedFloor: recentState.selectedFloor,
    selectedBorder: recentState.selectedBorder,
    selectedGrid: recentState.selectedGrid,
    selectedTileIndex: recentState.selectedTileIndex,
    addRecent,
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
