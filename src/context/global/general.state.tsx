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
import {
  SET_CURRENT_CATEGORY,
  SET_CURRENT_TYPE,
  SET_COLOR,
  SET_PREVIEW,
  ADD_TO_RECENT,
  SHOW_MODAL
} from '../types';

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
        setShowModal,
        setCurrentCategory,
        setCurrentType,
        setColor,
        setPreview,
        addToRecent
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
