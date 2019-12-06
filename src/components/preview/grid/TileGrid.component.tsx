import React, { useContext } from 'react';
import RecentContext from '../../../context/recent/recent.context';
import SimpleGrid from './subGrid/SimpleGrid.component';
import DoubleGrid from './subGrid/DoubleGrid.component';

const TileGrid: React.FC = () => {
  const { selectedFloor, selectedBorder } = useContext(RecentContext);
  return selectedBorder && selectedBorder.cornerInteriorUrl ? (
    <DoubleGrid selectedFloor={selectedFloor} selectedBorder={selectedBorder} />
  ) : (
    <SimpleGrid selectedFloor={selectedFloor} selectedBorder={selectedBorder} />
  );
};

export default TileGrid;
