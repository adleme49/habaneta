import React, { Fragment } from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import DoubleHorizontal from './DoubleHorizontal.component';
import DoubleBody from './DoubleBody.component';

const DoubleGrid: React.FC<{
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedGrid?: number[];
}> = ({ selectedFloor, selectedBorder,selectedGrid }) => (
  <Fragment>
    <DoubleHorizontal tile={selectedBorder} />
    <DoubleBody borderTile={selectedBorder} floorTile={selectedFloor} selectedGrid={selectedGrid} />
    <DoubleBody borderTile={selectedBorder} floorTile={selectedFloor} />
    <DoubleBody borderTile={selectedBorder} floorTile={selectedFloor} />
  </Fragment>
);

export default DoubleGrid;
