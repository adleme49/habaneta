import React, { useContext } from 'react';
import { ITile } from '../../context/interfaces';
import { styleSVG } from '../../helpers';
import GeneralContext from '../../context/global/general.context';
import SVGTileBase from './SVGBase.component';

const SVGTile: React.FC<{
  tile: ITile;
  width?: number;
  height?: number;
  rotation?: number;
  url?: string;
  check?: boolean;
  onClickHandler?: (event: any) => void;
}> = ({ tile, width, height, rotation, onClickHandler, url, check }) => {
  const { svgHeight, setSVGHeight, svgWidth, setSVGWidth } = useContext(
    GeneralContext
  );
  const setHeight = (height: number, width: number) => {
    if (check && !svgHeight) {
      setSVGHeight(height);
      setSVGHeight(width);
    }
  };
  return (
    <SVGTileBase
      tile={tile}
      url={url}
      style={{
        height: svgHeight,
        width: svgWidth
      }}
      onClickHandler={onClickHandler}
      beforeInjection={svg => {
        setHeight(svg.clientHeight, svg.clientWidth);
        styleSVG(svg, { width, height, rotation });
      }}
      afterInjection={(error, svg) => {
        if (svg) {
          setHeight(svg.clientHeight, svg.clientWidth);
        }
      }}
    />
  );
};

export default SVGTile;
