import { IGeneralState } from './general.models';
import {
  SET_CURRENT_FAMILY,
  SET_CURRENT_TILE,
  SET_CURRENT_TILE_FROM_RECENT,
  SHOW_SAVE_MODAL,
  SHOW_ENVIROMENT_MODAL,
  GlobalAction,
  ENABLE_RECENT,
  DISABLE_RECENT,
  SHOW_GALLERY_MODAL,
  CLOSE_MODALS,
  SET_SVG_HEIGHT
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
    case SHOW_GALLERY_MODAL:
      const showGModal = state.showGalleryModal;
      return {
        ...state,
        showGalleryModal: !showGModal
      };
    case CLOSE_MODALS:
      return {
        ...state,
        showGalleryModal: false,
        showEnviromentModal: false,
        showSaveModal: false
      };
    case ENABLE_RECENT:
      return {
        ...state,
        isRecent: true
      };
    case DISABLE_RECENT:
      return {
        ...state,
        isRecent: false
      };
    case SET_SVG_HEIGHT: {
      const h = action.payload;
      if (h) {
        return {
          ...state,
          svgHeight: h
        };
      }
      return state;
    }
    default:
      return state;
  }
};

export default GeneralReducer;
