import React from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import { useStore } from '../../../../store/store';
import DoubleHorizontal from './DoubleHorizontal.component';
import DoubleBody from './DoubleBody.component';

const DoubleGrid: React.FC<{
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedGrid?: number[];
}> = ({ selectedFloor, selectedBorder, selectedGrid }) => {
  const { gridBodyRows } = useStore();
  return (
    <>
      <DoubleHorizontal tile={selectedBorder} />
      {Array.from({ length: gridBodyRows }).map((_, i) => (
        <DoubleBody
          key={i}
          borderTile={selectedBorder}
          floorTile={selectedFloor}
          selectedGrid={selectedGrid}
        />
      ))}
    </>
  );
};

export default DoubleGrid;
