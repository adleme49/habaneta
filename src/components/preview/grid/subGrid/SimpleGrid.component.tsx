import React, { Fragment } from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import Horizontal from './Horizontal.component';
import Body from './Body.component';

const SimpleGrid: React.FC<{
  selectedFloor?: IFloor;
  selectedBorder?: IBorder;
  selectedGrid?: number[];
}> = ({ selectedFloor, selectedBorder, selectedGrid }) => (
  <Fragment>
    <Horizontal orientation={'TOP'} tile={selectedBorder as IBorder} />
    <Body
      borderTile={selectedBorder}
      floorTile={selectedFloor}
      grid={selectedGrid}
    />
    <Body
      borderTile={selectedBorder}
      floorTile={selectedFloor}
      grid={selectedGrid}
    />
    <Body
      borderTile={selectedBorder as IBorder}
      floorTile={selectedFloor}
      grid={selectedGrid}
    />
    <Horizontal orientation={'BOTTOM'} tile={selectedBorder as IBorder} />
  </Fragment>
);

export default SimpleGrid;
