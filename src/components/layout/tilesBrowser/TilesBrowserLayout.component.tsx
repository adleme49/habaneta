import React, { Fragment } from 'react';
import { IonRow, IonCol } from '@ionic/react';
import TilesCategory from '../../browser/tilesCategory/TilesCategory.component';

const TilesBrowserLayout: React.FC = () => {
  return (
    <Fragment>
      <IonRow>
        <h2>Buscador de Lozas</h2>
      </IonRow>
      <IonRow>
        <IonCol size='8'>
          <TilesCategory title={'TILES'} />
          <TilesCategory title={'BORDER'} />
        </IonCol>
        <IonCol>Loza</IonCol>
      </IonRow>
    </Fragment>
  );
};

export default TilesBrowserLayout;
