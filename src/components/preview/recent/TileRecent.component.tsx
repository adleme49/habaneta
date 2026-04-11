import React from 'react';
import { IBorder, IFloor } from '../../../context/interfaces';
import { useStore } from '../../../store/store';
import TileRecentItem from './TileRecentItem.component';

const TileRecent: React.FC = () => {
  const { recent } = useStore();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {recent.map((tile, index) => {
        const isEmpty = tile.name.includes('empty');
        return isEmpty ? (
          <div
            key={index}
            className="w-14 h-14 bg-gray-200 rounded flex-shrink-0"
          />
        ) : (
          <TileRecentItem
            tile={tile as IBorder | IFloor}
            key={index}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default TileRecent;
