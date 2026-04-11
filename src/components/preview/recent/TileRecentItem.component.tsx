import React from 'react';
import Default from '../../../theme/102.png';
import { ITile } from '../../../context/interfaces';
import { useStore } from '../../../store/store';
import SVGTile from '../../common/SVGTile.component';

const TileRecentItem: React.FC<{ tile: ITile; index: number }> = ({
  tile,
  index,
}) => {
  const { selectRecent, deleteRecent, selectedTileIndex } = useStore();
  const isActive = selectedTileIndex === index;

  return (
    <div
      className={`relative w-14 ${
        isActive ? 'ring-2 ring-blue-500 rounded' : ''
      }`}
    >
      {tile.layers ? (
        <SVGTile tile={tile} onClickHandler={() => selectRecent(index)} />
      ) : tile.imgUrl ? (
        <img
          src={tile.imgUrl}
          alt={tile.name}
          onClick={() => selectRecent(index)}
          className="cursor-pointer"
        />
      ) : (
        <img src={Default} alt={tile.name} />
      )}
      <button
        onClick={() => deleteRecent(index)}
        className="absolute top-0 right-0 bg-red-500 text-white text-[10px] leading-none w-4 h-4 rounded-sm cursor-pointer"
      >
        ×
      </button>
    </div>
  );
};

export default TileRecentItem;
