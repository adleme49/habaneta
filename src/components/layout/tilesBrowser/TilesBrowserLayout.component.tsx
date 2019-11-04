import React, { Fragment } from 'react';
import { IonRow, IonCol } from '@ionic/react';
import TilesCategory from '../../browser/tilesCategory/TilesCategory.component';
import TilesSelector from '../../browser/tilesSelector/TilesSelector.component';

const TilesBrowserLayout: React.FC = () => {
  return (
    <Fragment>
      <IonRow>
        <h2>Buscador de Lozas</h2>
      </IonRow>
      <IonRow>
        <IonCol size='7 '>
          <TilesCategory title={'TILES'} />
          <TilesCategory title={'BORDER'} />
        </IonCol>
        <IonCol>
          <TilesSelector />
        </IonCol>
      </IonRow>
    </Fragment>
  );
};

export default TilesBrowserLayout;
