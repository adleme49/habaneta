import React from 'react';
import { useStore } from '../../store/store';
import { ITile } from '../../context/interfaces';
import { styleSVG } from '../../helpers';
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
  const { svgHeight, setSvgHeight } = useStore();

  const setHeight = (h: number) => {
    if (check && !svgHeight) {
      setSvgHeight(h);
    }
  };

  return (
    <SVGTileBase
      tile={tile}
      url={url}
      style={{
        height: svgHeight,
        width: 'auto',
      }}
      onClickHandler={onClickHandler}
      beforeInjection={(svg) => {
        setHeight(svg.clientHeight);
        styleSVG(svg, { width, height, rotation });
      }}
      afterInjection={(svg) => {
        if (svg) {
          setHeight(svg.clientHeight);
        }
      }}
    />
  );
};

export default SVGTile;
