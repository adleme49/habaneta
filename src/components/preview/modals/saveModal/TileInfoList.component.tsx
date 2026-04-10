import React from 'react';
import { Dict } from '../../../../context/interfaces';

const TileInfoList: React.FC<{ layers: Dict<string> }> = ({ layers }) => (
  <div className="flex gap-4">
    {chunkSize4(Object.keys(layers).map(key => layers[key])).map(
      (layerChunk, iCol) => (
        <div key={iCol}>
          {layerChunk.map((color, iRow) => (
            <p key={iRow} className="text-sm">
              Capa {iCol * 4 + iRow + 1}: {color}
            </p>
          ))}
        </div>
      )
    )}
  </div>
);

export default TileInfoList;

const chunk = (size: number) => (arr: any[]): Array<any[]> => {
  const R: any[] = [];
  for (var i = 0; i < arr.length; i += size) R.push(arr.slice(i, i + size));
  return R;
};

const chunkSize4 = chunk(4);
