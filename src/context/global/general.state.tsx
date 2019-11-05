import React, { useReducer } from 'react';
import { iGeneralState, initialDomivalues } from '../interfaces';
import GeneralContext from './general.context';
import GeneralReducer from './general.reducer';

const GeneralState = (props: any): JSX.Element => {
  const initialState: iGeneralState = initialDomivalues;
  const [state, dispatch] = useReducer(GeneralReducer, initialState);
  return (
    <GeneralContext.Provider
      value={{
        loading: state.loading,
        error: state.error,
        tilesCategory: state.tilesCategory,
        borderCategory: state.borderCategory,
        selectedCategory: state.selectedCategory
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
