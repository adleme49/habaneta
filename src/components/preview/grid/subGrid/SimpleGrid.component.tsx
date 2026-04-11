import React from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import { useStore } from '../../../../store/store';
import Horizontal from './Horizontal.component';
import Body from './Body.component';

/**
 * Top border row → N × body → bottom border row.
 * N comes from the store (gridBodyRows) and is clamped to [1, 6].
 */
const SimpleGrid: React.FC<{
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedGrid?: number[];
}> = ({ selectedFloor, selectedBorder, selectedGrid }) => {
  const { gridBodyRows } = useStore();
  return (
    <>
      <Horizontal orientation="TOP" tile={selectedBorder as IBorder} />
      {Array.from({ length: gridBodyRows }).map((_, i) => (
        <Body
          key={i}
          borderTile={selectedBorder}
          floorTile={selectedFloor}
          grid={selectedGrid}
        />
      ))}
      <Horizontal orientation="BOTTOM" tile={selectedBorder as IBorder} />
    </>
  );
};

export default SimpleGrid;
