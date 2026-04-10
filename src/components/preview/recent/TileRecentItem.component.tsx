import React, { useContext } from 'react';
import Default from '../../../theme/102.png';
import { ITile } from '../../../context/interfaces';
import RecentContext from '../../../context/recent/recent.context';
import SVGTile from '../../common/SVGTile.component';

const TileRecentItem: React.FC<{ tile: ITile; index: number }> = ({
  tile,
  index
}) => {
  const { selectLatest, deleteRecent } = useContext(RecentContext);

  const handleDelete = () => {
    deleteRecent(index);
  };
  const onSetCurrentTilefromRecent = () => {
    selectLatest(index);
  };

  return (
    <div className="relative w-16">
      {tile.layers ? (
        <SVGTile tile={tile} onClickHandler={onSetCurrentTilefromRecent} />
      ) : tile.imgUrl ? (
        <img
          src={tile.imgUrl}
          alt={tile.name}
          onClick={onSetCurrentTilefromRecent}
          className="cursor-pointer"
        />
      ) : (
        <img src={Default} alt={tile.name} />
      )}
      <span
        onClick={handleDelete}
        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 cursor-pointer rounded-sm"
      >
        X
      </span>
    </div>
  );
};

export default TileRecentItem;
