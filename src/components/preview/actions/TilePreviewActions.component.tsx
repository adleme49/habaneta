import domtoimage from 'dom-to-image';
import React, { useState } from 'react';
import { useStore } from '../../../store/store';
import { buildShareUrl } from '../../../lib/design-url';
import { Button } from '@/components/ui/button';

const TilePreviewActions: React.FC = () => {
  const { openModal, setGridImg, toggleOverlay, getCurrentDesign } = useStore();
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // Enviroment modal still renders the captured grid composited on
  // the ambient background, so we keep the dom-to-image path for it.
  const captureAndOpenEnviroment = () => {
    toggleOverlay();
    const grid = document.getElementById('grid');
    if (grid) {
      domtoimage.toPng(grid).then((dataUrl) => {
        setGridImg(dataUrl);
        toggleOverlay();
        openModal('enviroment');
      });
    }
  };

  const handleShare = async () => {
    const url = buildShareUrl(getCurrentDesign());
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Link copied');
    } catch {
      // Fallback: show the URL so the user can copy it manually.
      setShareStatus(url);
    }
    window.setTimeout(() => setShareStatus(null), 3000);
  };

  return (
    <div className="flex items-center gap-2 py-2">
      <Button variant="outline" onClick={() => openModal('gallery')}>
        Gallery
      </Button>
      <Button variant="outline" onClick={captureAndOpenEnviroment}>
        Enviroment
      </Button>
      <Button onClick={handleShare}>Share</Button>
      {shareStatus && (
        <span
          className="text-xs text-green-700 truncate"
          aria-live="polite"
          title={shareStatus}
        >
          {shareStatus}
        </span>
      )}
    </div>
  );
};

export default TilePreviewActions;
