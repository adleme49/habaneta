import React, { Fragment } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import TilesBrowserLayout from '../tilesBrowser/TilesBrowserLayout.component';
import TilesEditorLayout from '../tilesEditor/TilesEditorLayout.component';
import TilesPreviewLayout from '../tilesPreview/TilesPreviewLayout.component';
import EnviromentModal from '../../preview/enviromentsModal/EnviromentModal.component';

const MainLayaout: React.FC = () => {
  return (
    <Fragment>
      <IonGrid style={{ height: '100%' }} className="ion-padding">
        <IonRow>
          <IonCol>
            <TilesBrowserLayout />
          </IonCol>
          <IonCol>
            <TilesEditorLayout />
          </IonCol>
          <IonCol size="5">
            <TilesPreviewLayout />
          </IonCol>
        </IonRow>
        <EnviromentModal />
      </IonGrid>
    </Fragment>
  );
};

export default MainLayaout;
