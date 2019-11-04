import React, { Fragment } from 'react';
import { IonRow, IonCol } from '@ionic/react';

const TilesEditorLayout: React.FC = () => {
  return (
    <Fragment>
      <IonRow>
        <h2>Editor</h2>
      </IonRow>
      <IonRow>
        <h3>Paleta de colores</h3>
      </IonRow>
      <IonRow>
        <h3>Current color</h3>
      </IonRow>
      <IonRow>
        <h3>Imagen</h3>
      </IonRow>
    </Fragment>
  );
};

export default TilesEditorLayout;
