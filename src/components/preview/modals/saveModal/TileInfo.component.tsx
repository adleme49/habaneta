import { IonCol, IonRow, IonText } from '@ionic/react';
import React, { Fragment } from 'react';
import { IBorder, IFloor } from '../../../../context/interfaces';
import SVGTileBase from '../../../common/SVGBase.component';
import TileInfoList from './TileInfoList.component';

const TileInfo: React.FC<{ tile: IFloor | IBorder }> = ({ tile }) => {
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
        {tile.layers ? <TileInfoList layers={tile.layers} /> : null}
      </IonCol>
    </Fragment>
  );
};

export default TileInfo;
