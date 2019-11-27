import { IRecentState } from './recent.models';
import {
  RecentAction,
  DELETE_RECENT,
  SELECT_LATEST,
  ADD_RECENT,
  UPDATE_SELECTED
} from './recent.actions';
import { ITile } from '../interfaces';

const reducer = (state: IRecentState, action: RecentAction): IRecentState => {
  switch (action.type) {
    case SELECT_LATEST: {
      const tile = state.recent[action.payload];
      const selectedTileIndex = action.payload;
      if (tile.type === 'Floor') {
        return {
          ...state,
          selectedTileIndex,
          selectedFloor: tile,
          selectedFloorIndex: action.payload
        };
      }
      return {
        ...state,
        selectedTileIndex,
        selectedBorder: tile,
        selectedBorderIndex: action.payload
      };
    }
    case UPDATE_SELECTED: {
      if (state.selectedTileIndex !== undefined) {
        const recentCopy = [...state.recent];
        recentCopy[state.selectedTileIndex] = action.payload;
        if (state.selectedTileIndex === state.selectedBorderIndex) {
          return {
            ...state,
            recent: recentCopy,
            selectedBorder: action.payload
          };
        }
        return {
          ...state,
          recent: recentCopy,
          selectedFloor: action.payload
        }
      }
      return state;
    }
    case ADD_RECENT: {
      const tile = action.payload;
      let empty: any[] = [];
      let recents: any[] = [];
      state.recent.filter((current: ITile) => {
        return current.name === 'empty'
          ? empty.push(current)
          : recents.push(current);
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
        return {
          ...state,
          recent,
          count,
          selectedFloor: tile,
          selectedFloorIndex: count - 1,
          selectedTileIndex: count - 1
        };
      }
      return {
        ...state,
        recent,
        count,
        selectedBorder: tile,
        selectedBorderIndex: count - 1,
        selectedTileIndex: count - 1
      };
    }
    case DELETE_RECENT: {
      const index = action.payload;
      const recent = [
        ...state.recent.filter((_, i) => index !== i),
        { name: 'empty' }
      ];
      const count = state.count - 1;
      const selectedTileIndex =
        state.selectedTileIndex === index
          ? undefined
          : state.selectedTileIndex && state.selectedTileIndex > index
          ? state.selectedTileIndex - 1
          : state.selectedTileIndex;
      const selectedFloorIndex =
        state.selectedFloorIndex && state.selectedFloorIndex > index
          ? state.selectedFloorIndex - 1
          : state.selectedFloorIndex;
      const selectedBorderIndex =
        state.selectedBorderIndex && state.selectedBorderIndex > index
          ? state.selectedBorderIndex - 1
          : state.selectedBorderIndex;
      if (index === state.selectedBorderIndex) {
        return {
          ...state,
          recent,
          count,
          selectedTileIndex,
          selectedBorder: undefined,
          selectedBorderIndex: undefined,
          selectedFloorIndex
        };
      } else if (index === state.selectedFloorIndex) {
        return {
          ...state,
          recent,
          count,
          selectedTileIndex,
          selectedFloor: undefined,
          selectedFloorIndex: undefined,
          selectedBorderIndex
        };
      }
      return {
        ...state,
        recent,
        count,
        selectedTileIndex,
        selectedFloorIndex,
        selectedBorderIndex
      };
    }
    default:
      return state;
  }
};

export default reducer;
