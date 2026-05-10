import React from 'react';
import TilesBrowserLayout from '../tilesBrowser/TilesBrowserLayout.component';
import TilesEditorLayout from '../tilesEditor/TilesEditorLayout.component';
import TilesPreviewLayout from '../tilesPreview/TilesPreviewLayout.component';
import EnviromentModal from '../../preview/modals/enviromentsModal/EnviromentModal.component';
import GalleryModal from '../../preview/modals/galleryModal/GalleryModal.component';
import { useStore } from '../../../store/store';

/**
 * Main app shell — three columns that each manage their own internal
 * scroll. The browser sidebar can be collapsed to reclaim horizontal
 * space for the editor + preview, which matters on smaller viewports
 * or when the user is past the "pick a tile" stage and mostly
 * editing / reviewing.
 */
const MainLayout: React.FC = () => {
  const { isBrowserCollapsed } = useStore();

  const gridCols = isBrowserCollapsed
    ? '32px minmax(0,1.2fr) minmax(0,1.5fr)'
    : '220px minmax(0,1.2fr) minmax(0,1.5fr)';

  return (
    <>
      <div
        className="flex-1 overflow-hidden grid grid-cols-1 bg-gray-50 transition-[grid-template-columns] duration-200"
        style={{ gridTemplateColumns: gridCols }}
      >
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
      <GalleryModal />
    </>
  );
};

export default MainLayout;
