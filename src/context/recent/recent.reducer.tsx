import { IRecentState } from './recent.models';
import {
  SELECT_BORDER,
  SELECT_FLOOR,
  DELETE_RECENT,
  RecentAction
} from './recent.actions';

const reducer = (state: IRecentState, action: RecentAction): IRecentState => {
  switch (action.type) {
    case SELECT_BORDER:
      const selectedBorder = action.payload;
      return { ...state, selectedBorder };
    case SELECT_FLOOR:
      const selectedFloor = action.payload;
      return { ...state, selectedFloor };
    case DELETE_RECENT:
      const recent = state.recent.splice(action.payload)
      return { ...state, recent };
    default:
      return state;
  }
};

export default reducer;
