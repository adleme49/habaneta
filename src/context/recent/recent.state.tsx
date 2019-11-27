import React, { useReducer } from 'react';
import RecentReducer from './recent.reducer';
import RecentContext from './recent.context';
import { IRecentState, initialStateRecent } from './recent.models';
import { DeleteRecent, SelectLatest, AddRecent } from './recent.actions';
import { ITile } from '../interfaces';




const RecentState = (props: any): JSX.Element => {
  const initialState: IRecentState = initialStateRecent;
  const [{ selectedBorder, selectedFloor, recent }, dispatch] = useReducer(
    RecentReducer,
    initialState
  );

  const addRecent = (tile: ITile) => {
    dispatch(new AddRecent(tile));
  };
  const selectLatest = (index: number) => {
    dispatch(new SelectLatest(index));
  };
  const deleteRecent = (index: number) => {
    dispatch(new DeleteRecent(index));
  };
  return (
    <RecentContext.Provider
      value={{
        selectedBorder,
        selectedFloor,
        recent,
        addRecent,
        selectLatest,
        deleteRecent
      }}
    >
      {props.children}
    </RecentContext.Provider>
  );
};

export default RecentState;
