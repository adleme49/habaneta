import { IonCol, IonRow, IonText } from '@ionic/react';
import React, { Fragment } from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import SVGTileBase from '../../../common/SVGBase.component';

const TileInfo: React.FC<{ tile: IFloor | IBorder }> = ({ tile }) => {
  let layers = [];
  for (var layerId in tile.layers) {
    layers.push(tile.layers[layerId]);
  }
  return (
    <Fragment>
      <IonCol size="6">
        <IonRow>
          {tile.type === 'Floor' ? <h1>Piso</h1> : <h1>Borde</h1>}
        </IonRow>
        <IonRow>
          <SVGTileBase tile={tile} style={{ width: '50%' }} />
        </IonRow>
      </IonCol>
      <IonCol size="6">
        <IonRow>
          <h1>
            <IonText color="primary">Modelo:</IonText>
            {tile.name}
          </h1>
        </IonRow>
        <IonRow>
          <h1>
            <IonText color="black">Colores:</IonText>
          </h1>
        </IonRow>
        {Object.keys(tile.layers!).map((key, index) => (
          <IonRow key={index}>
            <h1>
              Capa {index + 1}: {tile.layers![key]}
            </h1>
          </IonRow>
        ))}
      </IonCol>
    </Fragment>
  );
};

export default TileInfo;
// {layers.map((layer, index) => (
//   <IonRow key={index}>
//     <h1>
//       Capa {index + 1}: {layer}
//     </h1>
//   </IonRow>
// ))}
