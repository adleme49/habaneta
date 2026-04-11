import React from 'react';
import TilesBrowserLayout from '../tilesBrowser/TilesBrowserLayout.component';
import TilesEditorLayout from '../tilesEditor/TilesEditorLayout.component';
import TilesPreviewLayout from '../tilesPreview/TilesPreviewLayout.component';
import EnviromentModal from '../../preview/modals/enviromentsModal/EnviromentModal.component';
import SaveModal from '../../preview/modals/saveModal/SaveModal.component';
import GalleryModal from '../../preview/modals/galleryModal/GalleryModal.component';

const MainLayout: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_2fr] gap-4 p-4">
        <TilesBrowserLayout />
        <TilesEditorLayout />
        <TilesPreviewLayout />
      </div>
      <EnviromentModal />
      <SaveModal />
      <GalleryModal />
    </>
  );
};

export default MainLayout;
