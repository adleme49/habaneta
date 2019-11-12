import {
  IonCol,
  IonGrid,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import empty from '../../../../theme/empty.png';
import GeneralContext from '../../../../context/global/general.context';

const SaveModalContent: React.FC = () => {
  const { latestFloor, latestBorder } = useContext(GeneralContext);
  return (
    <Fragment>
      <IonToolbar color="primary">
        <IonTitle>Save</IonTitle>
      </IonToolbar>
      <IonGrid fixed>
        <IonRow align-items-center>
          <IonCol align-self-center size="6">
            <h1>Datos del Cliente</h1>
            <IonItem>
              <IonLabel position="floating">Nombre</IonLabel>
              <IonInput></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Telf</IonLabel>
              <IonInput></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Direccion</IonLabel>
              <IonInput></IonInput>
            </IonItem>
          </IonCol>
          <IonCol align-self-center size="6">
            <IonRow align-items-end>
              {latestFloor ? (
                <IonImg src={latestFloor.imgUrl} alt={latestFloor.name} />
              ) : (
                <h2>No selecciono ninguna Loza</h2>
              )}
            </IonRow>
            <IonRow align-items-end>
              {latestBorder ? (
                <IonImg src={latestBorder.imgUrl} alt={latestBorder.name} />
              ) : (
                <h2>No selecciono ningun Borde</h2>
              )}
            </IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    </Fragment>
  );
};

export default SaveModalContent;
