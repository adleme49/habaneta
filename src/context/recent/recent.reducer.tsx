import { IRecentState } from './recent.models';
import {
  RecentAction,
  DELETE_RECENT,
  SELECT_LATEST,
  ADD_RECENT
} from './recent.actions';
import { ITile } from '../interfaces';

const reducer = (state: IRecentState, action: RecentAction): IRecentState => {
  switch (action.type) {
    case SELECT_LATEST: {
      const tile = state.recent[action.payload];
      if (tile.type === 'Floor') {
        return {
          ...state,
          selectedFloor: tile,
          selectedFloorIndex: action.payload
        };
      }
      return {
        ...state,
        selectedBorder: tile,
        selectedBorderIndex: action.payload
      };
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
          selectedFloorIndex: count - 1
        };
      }
      return {
        ...state,
        recent,
        count,
        selectedBorder: tile,
        selectedBorderIndex: count - 1
      };
    }
    case DELETE_RECENT: {
      const index = action.payload;
      const recent = [
        ...state.recent.filter((_, i) => index !== i),
        { name: 'empty' }
      ];
      const count = state.count - 1;
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
          selectedBorder: undefined,
          selectedBorderIndex: undefined,
          selectedFloorIndex
        };
      } else if (index === state.selectedFloorIndex) {
        return {
          ...state,
          recent,
          count,
          selectedFloor: undefined,
          selectedFloorIndex: undefined,
          selectedBorderIndex
        };
      }
      return {
        ...state,
        recent,
        count,
        selectedFloorIndex,
        selectedBorderIndex
      };
    }
    default:
      return state;
  }
};

export default reducer;
