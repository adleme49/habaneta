import React, { useReducer } from 'react';
import { IBorder, IFamily, IFloor } from '../interfaces';
import { borderFam, DomiColors, recentsUsed, tilesFam } from '../seed';
import {
  AddtoRecent,
  DeleteRecent,
  SetCurrentFamily,
  SetCurrentTile,
  SetCurrentTilefromRecent,
  SetLatest,
  SetPreview,
  SetShowEnviromentModal,
  SetShowGalleryModal,
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
  showGalleryModal: false,
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
      showGalleryModal,
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
  const setCurrentFamily = (current: IFamily) => {
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
  const setShowGalleryModal = () => {
    dispatch(new SetShowGalleryModal());
  };

  return (
    <GeneralContext.Provider
      value={{
        loading,
        showEnviromentModal,
        showSaveModal,
        showGalleryModal,
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
        setShowGalleryModal,
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
