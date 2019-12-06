import React, { Fragment } from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import Horizontal from './Horizontal.component';
import Body from './Body.component';

const SimpleGrid: React.FC<{
  selectedFloor: IFloor | undefined;
  selectedBorder: IBorder | undefined;
}> = ({ selectedFloor, selectedBorder }) => (
  <Fragment>
    <Horizontal orientation={'TOP'} tile={selectedBorder as IBorder} />
    <Body borderTile={selectedBorder} floorTile={selectedFloor} />
    <Body borderTile={selectedBorder} floorTile={selectedFloor} />
    <Body borderTile={selectedBorder as IBorder} floorTile={selectedFloor} />
    <Horizontal orientation={'BOTTOM'} tile={selectedBorder as IBorder} />
  </Fragment>
);

export default SimpleGrid;
