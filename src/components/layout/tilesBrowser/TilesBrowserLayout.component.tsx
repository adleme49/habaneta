import React, { Fragment } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

const TilesBrowserLayout: React.FC = () => {
  return (
    <Fragment>
      <IonRow>
        <h2>Buscador de Lozas</h2>
      </IonRow>
      <IonRow>
        <IonCol>Categorias</IonCol>
        <IonCol>Loza</IonCol>
      </IonRow>
    </Fragment>
  );
};

export default TilesBrowserLayout;
