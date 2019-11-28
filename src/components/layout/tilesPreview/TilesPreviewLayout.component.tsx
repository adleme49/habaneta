import React, { Fragment } from 'react';
import { IonRow, IonCol } from '@ionic/react';
import TileRecent from '../../preview/recent/TileRecent.component';
import TileGrid from '../../preview/grid/TileGrid.component';
import TilePreviewActions from '../../preview/actions/TilePreviewActions.component';

const TilesPreviewLayout: React.FC = () => {
  return (
    <Fragment>
      <IonRow>
        <h2>Preview</h2>
      </IonRow>

      <IonRow align-items-center>
        <TileRecent />
      </IonRow>
      <IonRow>
        <IonCol size="10" offset="1" style={{ padding: '1.5rem 0rem' }}>
          <TileGrid />
        </IonCol>
      </IonRow>
      <IonRow>
        <TilePreviewActions />
      </IonRow>
    </Fragment>
  );
};

export default TilesPreviewLayout;
