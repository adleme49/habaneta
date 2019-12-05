import React, { useContext } from 'react';
import ReactSVG from 'react-svg';
import { ITile } from '../../context/interfaces';
import { getColorShapes, paintLayer, styleSVG } from '../../helpers';
import GeneralContext from '../../context/global/general.context';

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
    <ReactSVG
      src={url ? url : (tile.imgUrl as string)}
      style={{
        height: svgHeight,
        width: svgWidth
      }}
      className="svg-wrapper"
      onClick={onClickHandler}
      beforeInjection={svg => {
        setHeight(svg.clientHeight, svg.clientWidth);
        styleSVG(svg, { width, height, rotation });
        const shapes = getColorShapes(svg);
        if (tile.layers) {
          Object.keys(tile.layers).forEach(layerId => {
            if (tile.layers) {
              paintLayer(shapes, layerId, tile.layers[layerId]);
            }
          });
        }
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
