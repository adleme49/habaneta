import React, { Fragment, useContext } from 'react';
import { IBorder, IFloor } from '../../../context/interfaces';
import RecentContext from '../../../context/recent/recent.context';
import Body from './subGrid/Body.component';
import Horizontal from './subGrid/Horizontal.component';

const TileGrid: React.FC = () => {
  const { selectedFloor, selectedBorder } = useContext(RecentContext);
  return (
    <Fragment>
      <div id="test2">
        <Horizontal orientation={'TOP'} tile={selectedBorder as IBorder} />
        <Body
          borderTile={selectedBorder as IBorder}
          floorTile={selectedFloor as IFloor}
        />
        <Body
          borderTile={selectedBorder as IBorder}
          floorTile={selectedFloor as IFloor}
        />
        <Body
          borderTile={selectedBorder as IBorder}
          floorTile={selectedFloor as IFloor}
        />
        <Horizontal orientation={'BOTTOM'} tile={selectedBorder as IBorder} />
      </div>
    </Fragment>
  );
};

export default TileGrid;
