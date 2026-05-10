import React from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import empty from '../../../../theme/empty.png';
import SVGTile from '../../../common/SVGTile.component';
import FloorGrid from './FloorGrid.component';

const Body: React.FC<{
  borderTile?: IBorder;
  floorTile?: IFloor;
  grid?: number[];
}> = ({ borderTile, floorTile, grid }) => {
  return (
    <>
      <div className="flex p-0 m-0">
        <div className="flex-1 p-0 m-0">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={-90} />
          ) : (
            <img src={empty} alt="" />
          )}
        </div>
        <FloorGrid tile={floorTile} orientation={'TOP'} grid={grid} />
        <FloorGrid tile={floorTile} orientation={'TOP'} grid={grid} />
        <FloorGrid tile={floorTile} orientation={'TOP'} grid={grid} />
        <div className="flex-1 p-0 m-0">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={90} />
          ) : (
            <img src={empty} alt="" />
          )}
        </div>
      </div>
      <div className="flex p-0 m-0">
        <div className="flex-1 p-0 m-0">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={-90} />
          ) : (
            <img src={empty} alt="" />
          )}
        </div>
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} grid={grid} />
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} grid={grid} />
        <FloorGrid tile={floorTile} orientation={'BOTTOM'} grid={grid} />
        <div className="flex-1 p-0 m-0">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={90} />
          ) : (
            <img src={empty} alt="" />
          )}
        </div>
      </div>
    </>
  );
};

export default Body;
