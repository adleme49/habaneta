import React from 'react';
import { IBorder, IFloor } from '../../../context/interfaces';
import empty from '../../../theme/empty.png';
import TileRecentItem from './TileRecentItem.component';
import { useStore } from '../../../store/store';

const TileRecent: React.FC = () => {
  const { recent } = useStore();

  return (
    <>
      {recent.map((tile, index) => {
        return !tile.name.includes('empty') ? (
          <TileRecentItem tile={tile as IBorder | IFloor} key={index} index={index} />
        ) : (
          <div key={index} className="w-14">
            <img src={empty} alt="empty" />
          </div>
        );
      })}
    </>
  );
};

export default TileRecent;
