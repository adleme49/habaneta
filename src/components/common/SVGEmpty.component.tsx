import React from 'react';
import SVGTileBase from './SVGBase.component';
import { emptyTile } from '../../context/seed';

const SVGEmpty = () => (
  <SVGTileBase tile={emptyTile} style={{ height: 81, width: 81 }} />
);

export default SVGEmpty;
