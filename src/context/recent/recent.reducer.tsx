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
        return { ...state, selectedFloor: tile };
      }
      return {
        ...state,
        selectedBorder: tile
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
      return {
        ...state,
        recent
      };
    }
    case DELETE_RECENT: {
      const index = action.payload;
      const recent = [
        ...state.recent.slice().splice(index, 1),
        { name: 'empty' }
      ];

      if (index === state.selectedBorderIndex) {
        return {
          ...state,
          recent,
          selectedBorder: undefined,
          selectedBorderIndex: undefined
        };
      } else if (index === state.selectedFloorIndex) {
        return {
          ...state,
          recent,
          selectedFloor: undefined,
          selectedFloorIndex: undefined
        };
      }
      return { ...state, recent };
    }
    default:
      return state;
  }
};

export default reducer;
