import React, { useReducer } from 'react';
import { IBorder, IBorderFamily, IFloor, ITileFamily } from '../interfaces';
import { borderFam, DomiColors, recentsUsed, tilesFam } from '../seed';
import {
  SetCurrentFamily,
  SetCurrentTile,
  SetLatest,
  SetCurrentTilefromRecent,
  SetPreview,
  AddtoRecent,
  DeleteRecent,
  SetShowEnviromentModal,
  SetShowSaveModal
} from './general.actions';
import GeneralContext from './general.context';
import { IGeneralState } from './general.models';
import GeneralReducer from './general.reducer';

const initialDomivalues: IGeneralState = {
  loading: false,
  showModal: false,
  colors: DomiColors,
  tilesFamilys: tilesFam,
  borderFamilys: borderFam,
  showSaveModal: false,
  showEnviromentModal: false,
  recentsUsed: recentsUsed,
  error: null,
  preview: false
};

const GeneralState = (props: any): JSX.Element => {
  const initialState: IGeneralState = initialDomivalues;
  const [
    {
      loading,
      showEnviromentModal,
      showSaveModal,
      error,
      tilesFamilys,
      borderFamilys,
      colors,
      selectedFamily,
      selectedTile,
      latestFloor,
      latestBorder,
      recentsUsed,
      preview
    },
    dispatch
  ] = useReducer(GeneralReducer, initialState);

  // set CurrentCategory
  const setCurrentFamily = (current: ITileFamily | IBorderFamily) => {
    dispatch(new SetCurrentFamily(current));
  };
  const setCurrentTile = (current: IFloor | IBorder) => {
    dispatch(new SetCurrentTile(current));
    dispatch(new SetLatest());
  };

  const setCurrentTilefromRecent = (current: IFloor | IBorder) => {
    dispatch(new SetCurrentTilefromRecent(current));
    dispatch(new SetLatest());
  };

  const setPreview = () => {
    dispatch(new SetPreview());
  };

  const addToRecent = (current: IFloor | IBorder) => {
    dispatch(new AddtoRecent(current));
    setPreview();
  };

  const deleteRecent = (index: number) => {
    dispatch(new DeleteRecent(index));
  };

  const setShowEnviromentModal = () => {
    dispatch(new SetShowEnviromentModal());
  };
  const setShowSaveModal = () => {
    dispatch(new SetShowSaveModal());
  };

  return (
    <GeneralContext.Provider
      value={{
        loading,
        showEnviromentModal,
        showSaveModal,
        error,
        tilesFamilys,
        borderFamilys,
        colors,
        selectedFamily,
        selectedTile,
        latestFloor,
        latestBorder,
        recentsUsed,
        preview,
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
