import React from 'react';
import { ReactSVG } from 'react-svg';
import { ITile } from '../../context/interfaces';
import { getColorShapes, paintLayer } from '../../helpers';
import CompositionCanvas from './CompositionCanvas.component';

const SVGTileBase: React.FC<{
  tile: ITile;
  url?: string;
  rotation?: number;
  style?: React.CSSProperties;
  onClickHandler?: (event: any) => void;
  beforeInjection?: (svg: Element) => void;
  afterInjection?: (svg: SVGSVGElement) => void;
}> = ({
  tile,
  url,
  rotation,
  style,
  onClickHandler,
  afterInjection,
  beforeInjection
}) => {
  // v2-aware path: when the tile carries a backend pipeline, render via
  // CompositionCanvas so classed paths recolor through CSS variables.
  // Legacy `paintLayer` doesn't apply (it keys off "colora stN", a
  // different convention) and the ReactSVG injection roundtrip is wasted
  // when we already have the parsed SVG in memory.
  //
  // Rotation lands as a CSS transform on the wrapper. The legacy path
  // keeps using `beforeInjection` + `styleSVG` to set the SVG element's
  // own transform, which is equivalent for square containers (every
  // grid cell that uses rotation is square) but is set on the SVG
  // element rather than the wrapping div.
  if (!url && tile.pipeline) {
    const composed: React.CSSProperties = rotation
      ? { ...style, transform: `rotate(${rotation}deg)` }
      : style ?? {};
    return (
      <CompositionCanvas
        pipeline={tile.pipeline}
        mode="single"
        layers={tile.layers}
        style={composed}
        onClick={onClickHandler}
      />
    );
  }
  return (
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
};

export default SVGTileBase;
