import { iGeneralState, iAction } from '../interfaces';
import { SET_CURRENT_CATEGORY } from '../types';

const GeneralReducer = (state: iGeneralState, action: iAction) => {
  switch (action.type) {
    case SET_CURRENT_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };
    default:
      return state;
  }
};

export default GeneralReducer;
