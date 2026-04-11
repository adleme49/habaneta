import React from 'react';
import { TileSource, resolveTile, newInstance } from '../../../lib/library';
import { useStore } from '../../../store/store';
import SVGTileBase from '../../common/SVGBase.component';

const TileItem: React.FC<{ source: TileSource }> = ({ source }) => {
  const { selectEditingSource } = useStore();

  // Render the tile with its default colors as a thumbnail.
  const resolved = resolveTile(source, newInstance(source));

  return (
    <div
      className="cursor-pointer hover:bg-gray-50 p-1 rounded"
      onClick={() => selectEditingSource(source)}
    >
      <SVGTileBase tile={resolved} style={{ width: '100%', maxWidth: 240 }} />
    </div>
  );
};

export default TileItem;
