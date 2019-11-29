import React, { Fragment } from 'react';
import { IFloor, IBorder } from '../../../../context/interfaces';
import { IonRow, IonCol } from '@ionic/react';
import SVGTile from '../../../common/SVGTile.component';

const TileInfo: React.FC<{ tile: IFloor | IBorder }> = ({ tile }) => {
  return (
    <Fragment>
      <IonRow>
        <IonCol size="6">
          <IonRow>
            {tile.type === 'Floor' ? <h1>Piso</h1> : <h1>Borde</h1>}
          </IonRow>
          <SVGTile tile={tile} height={230} width={230} />
        </IonCol>
        <IonCol size="6">
          <IonRow>
            <h1>Nombre:</h1>
          </IonRow>
          <IonRow>
            <h2>{tile.name}</h2>
          </IonRow>
          <IonRow>
            <h1>Colores:</h1>
          </IonRow>
          <IonRow>
            <h1>Familia</h1>
          </IonRow>
        </IonCol>
      </IonRow>
    </Fragment>
  );
};

export default TileInfo;
