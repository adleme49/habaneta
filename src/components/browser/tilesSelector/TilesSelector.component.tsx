import React from 'react';
import TileItem from './TileItem.component';
import { useStore } from '../../../store/store';
import { IBorder, IFloor } from '../../../context/interfaces';

const TilesSelector: React.FC = () => {
  const { selectedFamily } = useStore();

  if (!selectedFamily) {
    return (
      <div className="text-xs text-gray-400 px-2 py-4">
        Select a category →
      </div>
    );
  }

  return (
    <div className="max-h-[70vh] overflow-y-auto space-y-1">
      {selectedFamily.types.map((tile: IFloor | IBorder) => (
        <TileItem key={tile.name} tile={tile} />
      ))}
    </div>
  );
};

export default TilesSelector;
