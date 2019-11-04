import React, { Fragment } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import TilesBrowserLayout from '../tilesBrowser/TilesBrowserLayout.component';
import TilesEditorLayout from '../tilesEditor/TilesEditorLayout.component';

const MainLayaout: React.FC = () => {
  return (
    <Fragment>
      <IonGrid>
        <IonRow>
          <IonCol>
            <TilesBrowserLayout />
          </IonCol>
          <IonCol>
            <TilesEditorLayout />
          </IonCol>
          <IonCol size='6'>ion-col</IonCol>
        </IonRow>
      </IonGrid>
    </Fragment>
  );
};

export default MainLayaout;
