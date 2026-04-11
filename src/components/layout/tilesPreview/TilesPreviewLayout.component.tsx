import React from 'react';
import TileRecent from '../../preview/recent/TileRecent.component';
import TileGrid from '../../preview/grid/TileGrid.component';
import TilePreviewActions from '../../preview/actions/TilePreviewActions.component';
import GridSizeControl from '../../preview/controls/GridSizeControl.component';

/**
 * Preview section. Title header removed — the floor grid itself
 * makes the column identity obvious. GridSizeControl moves into
 * the recent-row strip so the stepper remains close to the grid
 * it controls.
 */
const TilesPreviewLayout: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-3 pb-2 border-b flex-shrink-0 bg-white flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <TileRecent />
        </div>
        <GridSizeControl />
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
