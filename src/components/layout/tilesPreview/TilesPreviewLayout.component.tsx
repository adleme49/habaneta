import React from 'react';
import TileRecent from '../../preview/recent/TileRecent.component';
import TileGrid from '../../preview/grid/TileGrid.component';
import TilePreviewActions from '../../preview/actions/TilePreviewActions.component';
import GridSizeControl from '../../preview/controls/GridSizeControl.component';

/**
 * Preview section. Sticky header (title + grid size), sticky recent
 * row below, scrollable floor grid in the middle, sticky action
 * buttons at the bottom. No internal layout component may push the
 * page to scroll — everything is bounded.
 */
const TilesPreviewLayout: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex-shrink-0 flex items-center justify-between bg-white">
        <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
        <GridSizeControl />
      </div>
      <div className="px-4 pt-3 pb-2 border-b flex-shrink-0 bg-white">
        <TileRecent />
      </div>
      <div
        id="grid"
        className="flex-1 min-h-0 overflow-auto flex items-start justify-center p-4"
      >
        <div className="w-full max-w-[640px]">
          <TileGrid />
        </div>
      </div>
      <div className="px-4 py-2 border-t flex-shrink-0 bg-white">
        <TilePreviewActions />
      </div>
    </div>
  );
};

export default TilesPreviewLayout;
