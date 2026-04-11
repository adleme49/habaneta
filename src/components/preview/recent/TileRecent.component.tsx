import React from 'react';
import { useStore } from '../../../store/store';
import TileRecentItem from './TileRecentItem.component';

const TileRecent: React.FC = () => {
  const { recent } = useStore();

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {recent.map((slot, index) =>
        slot === null ? (
          <div
            key={index}
            className="w-14 h-14 bg-gray-200 rounded flex-shrink-0"
          />
        ) : (
          <TileRecentItem instance={slot} key={index} index={index} />
        )
      )}
    </div>
  );
};

export default TileRecent;
