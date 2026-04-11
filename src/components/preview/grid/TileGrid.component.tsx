import React from 'react';
import { useStore } from '../../../store/store';
import SimpleGrid from './subGrid/SimpleGrid.component';
import DoubleGrid from './subGrid/DoubleGrid.component';

const TileGrid: React.FC = () => {
  const { selectedFloor, selectedBorder, selectedGrid } = useStore();

  return selectedBorder && selectedBorder.cornerInteriorUrl ? (
    <DoubleGrid
      selectedFloor={selectedFloor}
      selectedBorder={selectedBorder}
      selectedGrid={selectedGrid}
    />
  ) : (
    <SimpleGrid
      selectedFloor={selectedFloor}
      selectedBorder={selectedBorder}
      selectedGrid={selectedGrid}
    />
  );
};

export default TileGrid;
