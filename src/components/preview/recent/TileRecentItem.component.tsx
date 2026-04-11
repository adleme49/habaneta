import React from 'react';
import Default from '../../../theme/102.png';
import { ITile } from '../../../context/interfaces';
import { useStore } from '../../../store/store';
import SVGTileBase from '../../common/SVGBase.component';

const TileRecentItem: React.FC<{ tile: ITile; index: number }> = ({
  tile,
  index,
}) => {
  const { selectRecent, deleteRecent, selectedTileIndex } = useStore();
  const isActive = selectedTileIndex === index;

  return (
    <div
      className={`relative w-14 h-14 flex-shrink-0 overflow-hidden rounded cursor-pointer ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => selectRecent(index)}
    >
      {tile.layers ? (
        <SVGTileBase
          tile={tile}
          style={{ width: '100%', height: '100%' }}
        />
      ) : tile.imgUrl ? (
        <img
          src={tile.imgUrl}
          alt={tile.name}
          className="w-full h-full object-cover"
        />
      ) : (
        <img src={Default} alt={tile.name} className="w-full h-full object-cover" />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteRecent(index);
        }}
        className="absolute top-0 right-0 bg-red-500 text-white text-[10px] leading-none w-4 h-4 flex items-center justify-center cursor-pointer"
      >
        ×
      </button>
    </div>
  );
};

export default TileRecentItem;
