import domtoimage from 'dom-to-image';
import React from 'react';
import { useStore } from '../../../store/store';

const TilePreviewActions: React.FC = () => {
  const { openModal, setGridImg, toggleOverlay } = useStore();

  const capture = (modal: 'enviroment' | 'save') => {
    toggleOverlay();
    const grid = document.getElementById('grid');
    if (grid) {
      domtoimage.toPng(grid).then((dataUrl) => {
        setGridImg(dataUrl);
        toggleOverlay();
        openModal(modal);
      });
    }
  };

  return (
    <div className="flex gap-2 py-4">
      <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={() => openModal('gallery')}>
        Gallery
      </button>
      <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={() => capture('enviroment')}>
        Enviroment
      </button>
      <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={() => capture('save')}>
        Save
      </button>
    </div>
  );
};

export default TilePreviewActions;
