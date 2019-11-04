import React, { Fragment } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

const MainLayaout: React.FC = () => {
  return (
    <Fragment>
      <IonGrid>
        <IonRow>
          <IonCol>ion-col</IonCol>
          <IonCol>ion-col</IonCol>
          <IonCol>ion-col</IonCol>
        </IonRow>
      </IonGrid>
    </Fragment>
  );
};

export default MainLayaout;
