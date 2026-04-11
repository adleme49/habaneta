import React from 'react';
import TilesBrowserLayout from '../tilesBrowser/TilesBrowserLayout.component';
import TilesEditorLayout from '../tilesEditor/TilesEditorLayout.component';
import TilesPreviewLayout from '../tilesPreview/TilesPreviewLayout.component';
import EnviromentModal from '../../preview/modals/enviromentsModal/EnviromentModal.component';
import SaveModal from '../../preview/modals/saveModal/SaveModal.component';
import GalleryModal from '../../preview/modals/galleryModal/GalleryModal.component';

/**
 * Main app shell — three columns that each manage their own internal
 * scroll. The outer grid is `flex-1 overflow-hidden` so the page
 * itself never scrolls; each column clips its overflow and any
 * content that wants to scroll does so inside a bounded region of
 * its column. This gives the "fluid app" feel instead of the old
 * "single long document" feel.
 */
const MainLayout: React.FC = () => {
  return (
    <>
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1.2fr)_minmax(0,1.5fr)] bg-gray-50">
        <aside className="h-full overflow-hidden border-r bg-white">
          <TilesBrowserLayout />
        </aside>
        <section className="h-full overflow-hidden">
          <TilesEditorLayout />
        </section>
        <section className="h-full overflow-hidden border-l bg-white">
          <TilesPreviewLayout />
        </section>
      </div>
      <EnviromentModal />
      <SaveModal />
      <GalleryModal />
    </>
  );
};

export default MainLayout;
