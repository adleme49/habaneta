import { IGeneralState } from './general.models';
import {
  SET_CURRENT_FAMILY,
  SET_CURRENT_TILE,
  SET_CURRENT_TILE_FROM_RECENT,
  SET_LATEST,
  SET_PREVIEW,
  ADD_TO_RECENT,
  DELETE_RECENT,
  SHOW_SAVE_MODAL,
  SHOW_ENVIROMENT_MODAL,
  GlobalAction
} from './general.actions';

const GeneralReducer = (
  state: IGeneralState,
  action: GlobalAction
): IGeneralState => {
  switch (action.type) {
    case SET_CURRENT_FAMILY:
      const family = action.payload;
      return {
        ...state,
        selectedFamily: family
      };
    case SET_CURRENT_TILE:
      const current = action.payload;
      return {
        ...state,
        selectedTile: {
          ...current,
          type: state.selectedFamily ? state.selectedFamily.type : undefined
        }
      };
    case SET_CURRENT_TILE_FROM_RECENT:
      const currentFRecent = action.payload;
      return {
        ...state,
        selectedTile: currentFRecent
      };
    case SET_LATEST:
      return {
        ...state,
        latestFloor: state.selectedTile
          ? state.selectedTile.type === 'Floor'
            ? state.selectedTile
            : state.latestFloor
          : undefined,
        latestBorder: state.selectedTile
          ? state.selectedTile.type === 'Border'
            ? state.selectedTile
            : state.latestBorder
          : undefined
      };
    case SET_PREVIEW:
      return {
        ...state,
        preview: true
      };
    case ADD_TO_RECENT:
      const addToRecent = action.payload;
      {
        let empty: any[] = [];
        let recents: any[] = [];
        state.recentsUsed.filter((current: any) => {
          return current.name === 'empty'
            ? empty.push(current)
            : recents.push(current);
        });
        if (empty.length > 0) {
          empty.push(addToRecent);
          empty.shift();
          empty.reverse();
        } else {
          recents.shift();
          recents.push(addToRecent);
        }
        let newRecent = [...recents, ...empty];
        return {
          ...state,
          recentsUsed: newRecent
        };
      }
    case DELETE_RECENT: {
      const indexFDeleted = action.payload;
      // Hacer el close preview cuando el deleted y el seleccionado son el mismo
      let deletedRecent = state.recentsUsed.slice();
      let deletedTile = deletedRecent.splice(indexFDeleted, 1);
      deletedRecent.push({ name: 'empty', id: '1' });
      if (state.selectedTile) {
        if (deletedTile[0].name === state.selectedTile.name) {
          return {
            ...state,
            recentsUsed: deletedRecent,
            selectedTile: undefined
          };
        }
      }
      return { ...state, recentsUsed: deletedRecent };
    }
    case SHOW_SAVE_MODAL:
      return {
        ...state,
        showSaveModal: !state.showSaveModal
      };
    case SHOW_ENVIROMENT_MODAL:
      return {
        ...state,
        showEnviromentModal: !state.showEnviromentModal
      };
    default:
      return state;
  }
};

export default GeneralReducer;
