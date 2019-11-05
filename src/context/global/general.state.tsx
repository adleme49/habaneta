import React, { useReducer } from 'react';
import {
  iGeneralState,
  initialDomivalues,
  borderCategory,
  tileCategory
} from '../interfaces';
import GeneralContext from './general.context';
import GeneralReducer from './general.reducer';
import { SET_CURRENT_CATEGORY } from '../types';

const GeneralState = (props: any): JSX.Element => {
  const initialState: iGeneralState = initialDomivalues;
  const [state, dispatch] = useReducer(GeneralReducer, initialState);

  // set CurrentCategory
  const setCurrentCategory = (current: tileCategory | borderCategory) => {
    dispatch({ type: SET_CURRENT_CATEGORY, payload: current });
  };
  return (
    <GeneralContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        tilesCategory: state.tilesCategory,
        borderCategory: state.borderCategory,
        selectedCategory: state.selectedCategory,
        setCurrentCategory
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
