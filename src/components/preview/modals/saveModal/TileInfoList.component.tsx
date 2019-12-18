import React from 'react';
import { Dict } from '../../../../context/interfaces';
import { IonRow, IonCol } from '@ionic/react';

const TileInfoList: React.FC<{ layers: Dict<string> }> = ({ layers }) => (
  <IonRow>
    {chunkSize4(Object.keys(layers).map(key => layers[key])).map(
      (layerChunk, iCol) => (
        <IonCol key={iCol}>
          {layerChunk.map((color, iRow) => (
            <IonRow key={iRow}>
              <h1>
                Capa {iCol * 4 + iRow + 1}: {color}
              </h1>
            </IonRow>
          ))}
        </IonCol>
      )
    )}
  </IonRow>
);

export default TileInfoList;

const chunk = (size: number) => (arr: any[]) => {
  var R = [];
  for (var i = 0; i < arr.length; i += size) R.push(arr.slice(i, i + size));
  return R;
};

const chunkSize5 = chunk(5);
const chunkSize4 = chunk(4);
