import React, { useContext } from 'react';
import RecentContext from '../../../context/recent/recent.context';
import SimpleGrid from './subGrid/SimpleGrid.component';

const TileGrid: React.FC = () => {
  const { selectedFloor, selectedBorder } = useContext(RecentContext);
  return (
    <SimpleGrid selectedFloor={selectedFloor} selectedBorder={selectedBorder} />
  );
};

export default TileGrid;
