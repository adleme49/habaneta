import { IGeneralState } from "./general.models";
import { useReducer } from "react";
import GeneralReducer from "./general.reducer";
import { ITileFamily, IBorderFamily, IFloor, IBorder } from "../interfaces";
import { SET_CURRENT_FAMILY, SET_CURRENT_TILE, SET_LATEST, SET_CURRENT_TILE_FROM_RECENT, SET_PREVIEW, ADD_TO_RECENT, DELETE_RECENT, SHOW_MODAL } from "./general.actions";
import { SET_COLOR } from "../editor/editor.actions";
import GeneralContext from "./general.context";


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

  const setColor = (color: string) => {
    dispatch({ type: SET_COLOR, payload: color });
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
        latestFloor: state.latestFloor,
        latestBorder: state.latestBorder,
        recentsUsed: state.recentsUsed,
        selectedColor: state.selectedColor,
        preview: state.preview,
        addToRecent,
        deleteRecent,
        setShowModal,
        setCurrentFamily,
        setCurrentTile,
        setCurrentTilefromRecent,
        setColor,
        setPreview
      }}
    >
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralState;
