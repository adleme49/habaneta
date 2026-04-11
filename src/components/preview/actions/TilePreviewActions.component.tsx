import domtoimage from 'dom-to-image';
import React from 'react';
import { useStore } from '../../../store/store';
import { Button } from '@/components/ui/button';

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
      <Button variant="outline" onClick={() => openModal('gallery')}>
        Gallery
      </Button>
      <Button variant="outline" onClick={() => capture('enviroment')}>
        Enviroment
      </Button>
      <Button variant="outline" onClick={() => capture('save')}>
        Save
      </Button>
    </div>
  );
};

export default TilePreviewActions;
