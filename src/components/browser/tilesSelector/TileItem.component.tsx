import React from 'react';
import { TileSource, resolveTile, newInstance } from '../../../lib/library';
import { useStore } from '../../../store/store';
import SVGTileBase from '../../common/SVGBase.component';

const TileItem: React.FC<{ source: TileSource }> = ({ source }) => {
  const { selectEditingSource } = useStore();

  // Render the tile with its default colors as a thumbnail.
  const resolved = resolveTile(source, newInstance(source));

  return (
    <button
      type="button"
      className="w-full cursor-pointer hover:bg-gray-50 p-0.5 rounded border border-transparent hover:border-gray-200 transition-colors"
      onClick={() => selectEditingSource(source)}
      title={source.displayName}
    >
      <SVGTileBase tile={resolved} style={{ width: '100%', height: 'auto' }} />
    </button>
  );
};

export default TileItem;
