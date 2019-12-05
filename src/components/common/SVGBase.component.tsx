import React from 'react';
import ReactSVG from 'react-svg';
import { ITile } from '../../context/interfaces';
import { getColorShapes, paintLayer } from '../../helpers';

const SVGTileBase: React.FC<{
  tile: ITile;
  url?: string;
  style?: React.CSSProperties;
  onClickHandler?: (event: any) => void;
  beforeInjection?: (svg: Element) => void;
  afterInjection?: (error: Error | null, svg: Element | undefined) => void;
}> = ({
  tile,
  url,
  style,
  onClickHandler,
  afterInjection,
  beforeInjection
}) => (
  <ReactSVG
    src={url ? url : (tile.imgUrl as string)}
    style={style}
    className="svg-wrapper"
    onClick={onClickHandler}
    beforeInjection={svg => {
      const shapes = getColorShapes(svg);
      if (tile.layers) {
        Object.keys(tile.layers).forEach(layerId => {
          if (tile.layers) {
            paintLayer(shapes, layerId, tile.layers[layerId]);
          }
        });
      }
      if (beforeInjection) beforeInjection(svg);
    }}
    afterInjection={afterInjection}
  />
);

export default SVGTileBase;
