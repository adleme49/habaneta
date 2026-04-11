import React from 'react';
import TileRecent from '../../preview/recent/TileRecent.component';
import TileGrid from '../../preview/grid/TileGrid.component';
import TilePreviewActions from '../../preview/actions/TilePreviewActions.component';
import GridSizeControl from '../../preview/controls/GridSizeControl.component';

const TilesPreviewLayout: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">Preview</h2>
        <GridSizeControl />
      </div>
      <div className="mb-2">
        <TileRecent />
      </div>
      <div id="grid">
        <TileGrid />
      </div>
      <TilePreviewActions />
    </div>
  );
};

export default TilesPreviewLayout;
