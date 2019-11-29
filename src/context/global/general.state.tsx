import React, { useReducer } from 'react';
import { IBorder, IFloor, IFamily } from '../interfaces';
import GeneralContext from './general.context';
import { IGeneralState, initialDomivalues } from './general.models';
import GeneralReducer from './general.reducer';
import {
  SetCurrentFamily,
  SetCurrentTile,
  SetLatest,
  SetCurrentTilefromRecent,
  SetShowEnviromentModal,
  SetShowSaveModal,
  EnableRecent,
  DisableRecent,
  SetShowGalleryModal,
  CloseModals,
  SetSVGHeight
} from './general.actions';

const GeneralState = (props: any): JSX.Element => {
  const initialState: IGeneralState = initialDomivalues;
  const [
    {
      svgHeight,
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
      isRecent,
      showModal
    },
    dispatch
  ] = useReducer(GeneralReducer, initialState);

  const setSVGHeight = (height: number) => {
    dispatch(new SetSVGHeight(height));
  };
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

  const setShowEnviromentModal = () => {
    dispatch(new SetShowEnviromentModal());
  };
  const setShowSaveModal = () => {
    dispatch(new SetShowSaveModal());
  };
  const enableRecent = () => {
    dispatch(new EnableRecent());
  };
  const disableRecent = () => {
    dispatch(new DisableRecent());
  };
  const setShowGalleryModal = () => {
    dispatch(new SetShowGalleryModal());
  };
  const closeModals = () => {
    dispatch(new CloseModals());
  };

  return (
    <GeneralContext.Provider
      value={{
        loading,
        svgHeight,
        showEnviromentModal,
        showSaveModal,
        showGalleryModal,
        error,
        tilesFamilys,
        borderFamilys,
        colors,
        selectedFamily,
        selectedTile,
        isRecent,
        setShowSaveModal,
        setShowEnviromentModal,
        setShowGalleryModal,
        setCurrentFamily,
        setCurrentTile,
        setCurrentTilefromRecent,
        setSVGHeight,
        closeModals,
        enableRecent,
        disableRecent,
        showModal
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
