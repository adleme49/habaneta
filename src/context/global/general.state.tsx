import React, { useReducer } from 'react';
import {
  IBorder,
  IBorderFamily,
  IGeneralState,
  initialDomivalues,
  IFloor,
  ITileFamily
} from '../interfaces';
import {
  ADD_TO_RECENT,
  SET_COLOR,
  SET_CURRENT_FAMILY,
  SET_PREVIEW,
  SHOW_MODAL,
  SET_CURRENT_TILE
} from '../types';
import GeneralContext from './general.context';
import GeneralReducer from './general.reducer';

const GeneralState = (props: any): JSX.Element => {
  const initialState: IGeneralState = initialDomivalues;
  const [state, dispatch] = useReducer(GeneralReducer, initialState);

  // set CurrentCategory
  const setCurrentFamily = (current: ITileFamily | IBorderFamily) => {
    dispatch({ type: SET_CURRENT_FAMILY, payload: current });
  };
  const setCurrentTile = (current: IFloor | IBorder) => {
    dispatch({ type: SET_CURRENT_TILE, payload: current });
  };

  const setColor = (color: string) => {
    dispatch({ type: SET_COLOR, payload: color });
  };

  const setPreview = () => {
    dispatch({ type: SET_PREVIEW });
  };

  const addToRecent = (current: IFloor | IBorder) => {
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
        tilesFamilys: state.tilesFamilys,
        borderFamilys: state.borderFamilys,
        colors: state.colors,
        selectedFamily: state.selectedFamily,
        selectedTile: state.selectedTile,
        recentsUsed: state.recentsUsed,
        selectedColor: state.selectedColor,
        preview: state.preview,
        addToRecent,
        setShowModal,
        setCurrentFamily,
        setCurrentTile,
        setColor,
        setPreview
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
