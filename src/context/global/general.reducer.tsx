import { iGeneralState, iAction } from '../interfaces';
import { SET_CURRENT_CATEGORY, SET_CURRENT_TYPE, SET_COLOR } from '../types';

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
    default:
      return state;
  }
};

export default GeneralReducer;
