import React, { useReducer } from 'react';
import {
  Border,
  borderCategory,
  iGeneralState,
  initialDomivalues,
  Tile,
  tileCategory
} from '../interfaces';
import {
  ADD_TO_RECENT,
  SET_COLOR,
  SET_CURRENT_CATEGORY,
  SET_CURRENT_TYPE,
  SET_PREVIEW,
  SHOW_MODAL
} from '../types';
import GeneralContext from './general.context';
import GeneralReducer from './general.reducer';

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

  const setPreview = () => {
    dispatch({ type: SET_PREVIEW });
  };

  const addToRecent = (current: Tile | Border) => {
    dispatch({ type: ADD_TO_RECENT, payload: current });
  };

  const setShowModal = () => {
    dispatch({ type: SHOW_MODAL });
  };

  return (
    <GeneralContext.Provider
      value={{
        loading: state.loading,
        showModal: state.showModal,
        error: state.error,
        tilesCategory: state.tilesCategory,
        borderCategory: state.borderCategory,
        selectedCategory: state.selectedCategory,
        selectedType: state.selectedType,
        recentUsed: state.recentsUsed,
        selectedColor: state.selectedColor,
        preview: state.preview,
        addToRecent,
        setShowModal,
        setCurrentCategory,
        setCurrentType,
        setColor,
        setPreview
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
