import React from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import empty from '../../../../theme/empty.png';
import SVGTile from '../../../common/SVGTile.component';
import FloorGrid from './FloorGrid.component';

const DoubleBody: React.FC<{
  borderTile?: IBorder;
  floorTile?: IFloor;
  selectedGrid?: number[];
}> = ({ borderTile, floorTile, selectedGrid }) => {
  return (
    <>
      <div className="flex p-0 m-0">
        <FloorGrid tile={floorTile} grid={selectedGrid} orientation={'TOP'} />
        <FloorGrid tile={floorTile} grid={selectedGrid} orientation={'TOP'} />
        <FloorGrid tile={floorTile} grid={selectedGrid} orientation={'TOP'} />
        <div className="flex-1 p-0 m-0">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={-90} />
          ) : (
            <img src={empty} alt="" />
          )}
        </div>
        <div className="flex-1 p-0 m-0">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={90} />
          ) : (
            <img src={empty} alt="" />
          )}
        </div>
      </div>
      <div className="flex p-0 m-0">
        <FloorGrid tile={floorTile} grid={selectedGrid} orientation={'BOTTOM'} />
        <FloorGrid tile={floorTile} grid={selectedGrid} orientation={'BOTTOM'} />
        <FloorGrid tile={floorTile} grid={selectedGrid} orientation={'BOTTOM'} />
        <div className="flex-1 p-0 m-0">
          {borderTile ? (
            <SVGTile tile={borderTile} rotation={-90} />
          ) : (
            <img src={empty} alt="" />
          )}
        </div>
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

export default DoubleBody;
