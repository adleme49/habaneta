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
  const { svgHeight, setSVGHeight } = useContext(GeneralContext);
  const setHeight = (value: any) => {
    if (check && !svgHeight) setSVGHeight(value);
  };
  return (
    <SVGTileBase
      tile={tile}
      url={url}
      style={{
        height: svgHeight,
        width: "auto"
      }}
      onClickHandler={onClickHandler}
      beforeInjection={svg => {
        setHeight(svg.clientHeight as any);
        styleSVG(svg, { width, height, rotation });
      }}
      afterInjection={(error, svg) => {
        if (svg) {
          setHeight(svg.clientHeight);
        }
      }}
    />
  );
};

export default SVGTile;
