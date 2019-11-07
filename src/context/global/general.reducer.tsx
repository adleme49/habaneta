import { iGeneralState, iAction } from '../interfaces';
import {
  SET_CURRENT_CATEGORY,
  SET_CURRENT_TYPE,
  SET_COLOR,
  SET_PREVIEW,
  ADD_TO_RECENT
} from '../types';

const GeneralReducer = (state: iGeneralState, action: iAction) => {
  switch (action.type) {
    case SET_CURRENT_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    case SET_CURRENT_TYPE:
      return {
        ...state,
        selectedType: action.payload
      };
    case SET_COLOR:
      return {
        ...state,
        selectedColor: action.payload
      };
    case SET_PREVIEW:
      return {
        ...state,
        preview: true
      };
    case ADD_TO_RECENT: {
      let empty: any[] = [];
      let recents: any[] = [];

      state.recentsUsed.filter((current: { name: string }) => {
        return current.name === 'empty'
          ? empty.push(current)
          : recents.push(current);
      });
      if (empty.length > 0) {
        empty.push(action.payload);
        empty.shift();
        empty.reverse();
      } else {
        recents.shift();
        recents.push(action.payload);
      }
      let newRecent = [...recents, ...empty];
      return {
        ...state,
        recentsUsed: newRecent
      };
    }
    default:
      return state;
  }
};

export default GeneralReducer;
