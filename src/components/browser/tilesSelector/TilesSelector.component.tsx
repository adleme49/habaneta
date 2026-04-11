import React from 'react';
import TileItem from './TileItem.component';
import { useStore } from '../../../store/store';

const TilesSelector: React.FC = () => {
  const { selectedFamily, tilesForSelectedFamily } = useStore();

  if (!selectedFamily) {
    return (
      <div className="text-xs text-gray-400 px-2 py-4">
        Select a category →
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto space-y-1">
      {tilesForSelectedFamily.map((source) => (
        <TileItem key={source.id} source={source} />
      ))}
    </div>
  );
};

export default TilesSelector;
