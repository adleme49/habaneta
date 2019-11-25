import React, { useReducer } from 'react';
import RecentReducer from './recent.reducer';
import RecentContext from './recent.context';
import { IRecentState } from './recent.models';
import { SelectFloor, SelectBorder, DeleteRecent } from './recent.actions';
import { IFloor, IBorder } from '../interfaces';

export const initialStateRecent: IRecentState = {
  recent: []
};

const RecentState = (props: any): JSX.Element => {
  const initialState: IRecentState = initialStateRecent;
  const [{ selectedBorder, selectedFloor, recent }, dispatch] = useReducer(
    RecentReducer,
    initialState
  );

  const selectFloor = (tile: IFloor) => {
    dispatch(new SelectFloor(tile));
  };
  const selectBorder = (tile: IBorder) => {
    dispatch(new SelectBorder(tile));
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
        selectFloor,
        selectBorder,
        deleteRecent
      }}
    >
      {props.children}
    </RecentContext.Provider>
  );
};

export default RecentState;
