import React, { useContext } from 'react';
import { IBorder, IFloor } from '../../../context/interfaces';
import empty from '../../../theme/empty.png';
import TileRecentItem from './TileRecentItem.component';
import RecentContext from '../../../context/recent/recent.context';

const TileRecent: React.FC = () => {
  const { recent } = useContext(RecentContext);

  return (
    <>
      {recent?.map((tile: IBorder | IFloor, index: number) => {
        return !tile.name.includes('empty') ? (
          <TileRecentItem tile={tile} key={index} index={index} />
        ) : (
          <div key={index} className="w-16">
            <img src={empty} alt="empty" />
          </div>
        );
      })}
    </>
  );
};

export default TileRecent;
