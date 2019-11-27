import React, { useReducer } from 'react';
import { IBorder, IFloor, IFamily } from '../interfaces';
import {
  SetCurrentFamily,
  SetCurrentTile,
  SetLatest,
  SetCurrentTilefromRecent,
  DeleteRecent,
  SetShowEnviromentModal,
  SetShowSaveModal,
  EnableRecent,
  DisableRecent
} from './general.actions';
import GeneralContext from './general.context';
import { IGeneralState, initialDomivalues } from './general.models';
import GeneralReducer from './general.reducer';

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
      isRecent,
      showModal
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

  const deleteRecent = (index: number) => {
    dispatch(new DeleteRecent(index));
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
        isRecent,
        deleteRecent,
        setShowSaveModal,
        setShowEnviromentModal,
        setCurrentFamily,
        setCurrentTile,
        setCurrentTilefromRecent,
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
