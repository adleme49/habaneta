import React, { Fragment } from 'react';
import { IonRow } from '@ionic/react';

const TilesPreviewLayout: React.FC = () => {
  return (
    <Fragment>
      <IonRow>
        <h2>Preview</h2>
      </IonRow>
      <IonRow>
        <h3>Recientes</h3>
      </IonRow>
      <IonRow>
        <h3>Preview</h3>
      </IonRow>
      <IonRow>
        <h3>Acciones</h3>
      </IonRow>
    </Fragment>
  );
};

export default TilesPreviewLayout;
