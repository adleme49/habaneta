import React, { useReducer } from 'react';
import {
  iGeneralState,
  initialDomivalues,
  borderCategory,
  tileCategory,
  Tile,
  Border
} from '../interfaces';
import GeneralContext from './general.context';
import GeneralReducer from './general.reducer';
import { SET_CURRENT_CATEGORY, SET_CURRENT_TYPE, SET_COLOR } from '../types';

const GeneralState = (props: any): JSX.Element => {
  const initialState: iGeneralState = initialDomivalues;
  const [state, dispatch] = useReducer(GeneralReducer, initialState);

  // set CurrentCategory
  const setCurrentCategory = (current: tileCategory | borderCategory) => {
    dispatch({ type: SET_CURRENT_CATEGORY, payload: current });
  };
  const setCurrentType = (current: Tile | Border) => {
    dispatch({ type: SET_CURRENT_TYPE, payload: current });
  };

  const setColor = (color: string) => {
    dispatch({ type: SET_COLOR, payload: color });
  };
  return (
    <GeneralContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        tilesCategory: state.tilesCategory,
        borderCategory: state.borderCategory,
        selectedCategory: state.selectedCategory,
        selectedType: state.selectedType,
        recentsUsed: state.recentsUsed,
        selectedColor: state.selectedColor,
        setCurrentCategory,
        setCurrentType,
        setColor
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
