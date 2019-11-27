import React, { Fragment } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import TilesBrowserLayout from '../tilesBrowser/TilesBrowserLayout.component';
import TilesEditorLayout from '../tilesEditor/TilesEditorLayout.component';
import TilesPreviewLayout from '../tilesPreview/TilesPreviewLayout.component';
import EnviromentModal from '../../preview/modals/enviromentsModal/EnviromentModal.component';
import SaveModal from '../../preview/modals/saveModal/SaveModal.component';
import GalleryModal from '../../preview/modals/galleryModal/GalleryModal.component';

import EditorState from '../../../context/editor/editor.state';
import RecentState from '../../../context/recent/recent.state';
const MainLayout: React.FC = () => {
  return (
    <Fragment>
      <EditorState>
        <RecentState>
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
            <SaveModal />
            <GalleryModal />
          </IonGrid>
        </RecentState>
      </EditorState>

    </Fragment>
  );
};

export default MainLayout;
