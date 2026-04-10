import React from 'react';
import TilesBrowserLayout from '../tilesBrowser/TilesBrowserLayout.component';
import TilesEditorLayout from '../tilesEditor/TilesEditorLayout.component';
import TilesPreviewLayout from '../tilesPreview/TilesPreviewLayout.component';
import EnviromentModal from '../../preview/modals/enviromentsModal/EnviromentModal.component';
import SaveModal from '../../preview/modals/saveModal/SaveModal.component';
import GalleryModal from '../../preview/modals/galleryModal/GalleryModal.component';
import EditorState from '../../../context/editor/editor.state';
import RecentState from '../../../context/recent/recent.state';

const MainLayout: React.FC = () => {
  return (
    <EditorState>
      <RecentState>
        <div className="grid grid-cols-[1fr_1fr_2fr] gap-4 p-4 h-full">
          <div>
            <TilesBrowserLayout />
          </div>
          <div>
            <TilesEditorLayout />
          </div>
          <div>
            <TilesPreviewLayout />
          </div>
        </div>
        <EnviromentModal />
        <SaveModal />
        <GalleryModal />
      </RecentState>
    </EditorState>
  );
};

export default MainLayout;
