import React, { useReducer } from 'react';
import { IBorder, IBorderFamily, IFloor, ITileFamily } from '../interfaces';
import { borderFamilys, DomiColors, recentsUsed, tilesFamilys } from '../seed';
import {
  ADD_TO_RECENT,
  DELETE_RECENT,
  SET_CURRENT_FAMILY,
  SET_CURRENT_TILE,
  SET_CURRENT_TILE_FROM_RECENT,
  SET_LATEST,
  SET_PREVIEW,
  SHOW_SAVE_MODAL,
  SHOW_ENVIROMENT_MODAL
} from './general.actions';
import GeneralContext from './general.context';
import { IGeneralState } from './general.models';
import GeneralReducer from './general.reducer';

const initialDomivalues: IGeneralState = {
  loading: false,
  showModal: false,
  colors: DomiColors,
  tilesFamilys: tilesFamilys,
  borderFamilys: borderFamilys,
  showSaveModal: false,
  showEnviromentModal: false,
  recentsUsed: recentsUsed,
  error: null,
  preview: false
};

const GeneralState = (props: any): JSX.Element => {
  const initialState: IGeneralState = initialDomivalues;
  const [state, dispatch] = useReducer(GeneralReducer, initialState);

  // set CurrentCategory
  const setCurrentFamily = (current: ITileFamily | IBorderFamily) => {
    dispatch({ type: SET_CURRENT_FAMILY, payload: current });
  };
  const setCurrentTile = (current: IFloor | IBorder) => {
    dispatch({ type: SET_CURRENT_TILE, payload: current });
    dispatch({ type: SET_LATEST });
  };

  const setCurrentTilefromRecent = (current: IFloor | IBorder) => {
    dispatch({ type: SET_CURRENT_TILE_FROM_RECENT, payload: current });
    dispatch({ type: SET_LATEST });
  };

  const setPreview = () => {
    dispatch({ type: SET_PREVIEW });
  };

  const addToRecent = (current: IFloor | IBorder) => {
    dispatch({ type: ADD_TO_RECENT, payload: current });
    setPreview();
  };

  const deleteRecent = (pos: number) => {
    dispatch({ type: DELETE_RECENT, payload: pos });
  };

  const setShowEnviromentModal = () => {
    dispatch({ type: SHOW_ENVIROMENT_MODAL });
  };
  const setShowSaveModal = () => {
    dispatch({ type: SHOW_SAVE_MODAL });
  };

  return (
    <GeneralContext.Provider
      value={{
        loading: state.loading,
        showEnviromentModal: state.showEnviromentModal,
        showSaveModal: state.showSaveModal,
        error: state.error,
        tilesFamilys: state.tilesFamilys,
        borderFamilys: state.borderFamilys,
        colors: state.colors,
        selectedFamily: state.selectedFamily,
        selectedTile: state.selectedTile,
        latestFloor: state.latestFloor,
        latestBorder: state.latestBorder,
        recentsUsed: state.recentsUsed,
        preview: state.preview,
        addToRecent,
        deleteRecent,
        setShowSaveModal,
        setShowEnviromentModal,
        setCurrentFamily,
        setCurrentTile,
        setCurrentTilefromRecent,
        setPreview
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
