import { IGeneralState, IAction } from '../interfaces';
import {
  SET_CURRENT_FAMILY,
  SET_CURRENT_TILE,
  SET_COLOR,
  SET_PREVIEW,
  ADD_TO_RECENT,
  SHOW_MODAL
} from '../types';

const GeneralReducer = (state: IGeneralState, action: IAction) => {
  switch (action.type) {
    case SET_CURRENT_FAMILY:
      return {
        ...state,
        selectedFamily: action.payload
      };
    case SET_CURRENT_TILE:
      return {
        ...state,
        selectedTile: action.payload
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
      state.recentsUsed.filter((current: any) => {
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
    case SHOW_MODAL:
      console.log('es aki');
      return {
        ...state,
        showModal: !state.showModal
      };
    default:
      return state;
  }
};

export default GeneralReducer;
