import React, { useReducer, useContext, useEffect } from 'react';
import RecentReducer from './recent.reducer';
import RecentContext from './recent.context';
import { IRecentState, initialStateRecent } from './recent.models';
import {
  DeleteRecent,
  SelectLatest,
  AddRecent,
  UpdateSelected
} from './recent.actions';
import { ITile } from '../interfaces';
import EditorContext from '../editor/editor.context';
import GeneralContext from '../global/general.context';

const RecentState = (props: any): JSX.Element => {
  const initialState: IRecentState = initialStateRecent;
  const [
    { selectedBorder, selectedFloor, selectedTileIndex, recent, count },
    dispatch
  ] = useReducer(RecentReducer, initialState);
  const { tile, setTile } = useContext(EditorContext);
  const { enableRecent, isRecent } = useContext(GeneralContext);

  useEffect(() => {
    if (tile && isRecent && (selectedTileIndex as number) >= 0) {
      dispatch(new UpdateSelected(tile));
    }
    // eslint-disable-next-line
  }, [tile]);

  const addRecent = (tile: ITile) => {
    enableRecent();
    dispatch(new AddRecent(tile));
  };
  const selectLatest = (index: number) => {
    enableRecent();
    dispatch(new SelectLatest(index));
    setTile(recent[index]);
  };
  const deleteRecent = (index: number) => {
    dispatch(new DeleteRecent(index));
  };
  const updateSelected = (tile: ITile) => {
    dispatch(new UpdateSelected(tile));
  };

  return (
    <RecentContext.Provider
      value={{
        count,
        selectedBorder,
        selectedFloor,
        selectedTileIndex,
        recent,
        addRecent,
        selectLatest,
        updateSelected,
        deleteRecent
      }}
    >
      {props.children}
    </RecentContext.Provider>
  );
};

export default RecentState;
