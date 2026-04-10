import domtoimage from 'dom-to-image';
import React, { useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';

const TilePreviewActions: React.FC = () => {
  const {
    setShowEnviromentModal,
    setShowSaveModal,
    setShowGalleryModal,
    saveGridImg,
    toggleOverlay
  } = useContext(GeneralContext);

  const domCapturer = (ModaltoOpen: Function) => {
    toggleOverlay();
    const grid = document.getElementById('grid');
    if (grid) {
      domtoimage.toPng(grid).then(dataUrl => {
        saveGridImg(dataUrl);
        toggleOverlay();
        ModaltoOpen();
      });
    }
  };

  const onEnviroment = () => {
    domCapturer(setShowEnviromentModal);
  };
  const onSave = () => {
    domCapturer(setShowSaveModal);
  };
  const onGallery = () => {
    setShowGalleryModal();
  };

  return (
    <div className="flex gap-2 py-4">
      <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={onGallery}>
        Gallery
      </button>
      <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={onEnviroment}>
        Enviroment
      </button>
      <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={onSave}>
        Save
      </button>
    </div>
  );
};

export default TilePreviewActions;
