import React from 'react';
import Default from '../../../theme/102.png';
import { IFloor, IBorder } from '../../../context/interfaces';
import { useStore } from '../../../store/store';
import SVGTileBase from '../../common/SVGBase.component';

const TileItem: React.FC<{ tile: IFloor | IBorder }> = ({ tile }) => {
  const { selectEditingTile } = useStore();

  return tile ? (
    <div
      className="cursor-pointer hover:bg-gray-50 p-1 rounded"
      onClick={() => selectEditingTile(tile)}
    >
      {tile.imgUrl ? (
        <SVGTileBase tile={tile} style={{ width: '100%', maxWidth: 240 }} />
      ) : (
        <img src={Default} alt={tile.name} />
      )}
    </div>
  ) : null;
};

export default TileItem;
