import React from 'react';
import TileRecent from '../../preview/recent/TileRecent.component';
import TileGrid from '../../preview/grid/TileGrid.component';
import TilePreviewActions from '../../preview/actions/TilePreviewActions.component';

const TilesPreviewLayout: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Preview</h2>
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
