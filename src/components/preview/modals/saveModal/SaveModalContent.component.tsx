import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonTitle,
  IonToolbar,
  IonIcon
} from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import RecentContext from '../../../../context/recent/recent.context';
import SVGTile from '../../../common/SVGTile.component';
import GeneralContext from '../../../../context/global/general.context';
import TileInfo from './TileInfo.component';

const SaveModalContent: React.FC<{ onClose: Function }> = ({ onClose }) => {
  const { selectedBorder, selectedFloor } = useContext(RecentContext);

  const handelDismiss = () => {
    onClose();
  };

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event.timeStamp);
  };

  return (
    <Fragment>
      <IonToolbar color="primary">
        <IonTitle>Save</IonTitle>
        <IonButtons slot="secondary">
          <IonButton onClick={handelDismiss}>
            <IonIcon name="close" slot="icon-only" />
          </IonButton>
        </IonButtons>
      </IonToolbar>

      <IonGrid fixed={true}>
        <IonRow>
          <IonCol size="6">
            <form onSubmit={onSubmitForm}>
              <IonRow>
                <h1>Datos del Cliente</h1>
              </IonRow>

              <IonRow>
                <IonItem>
                  <IonLabel position="floating">Nombre</IonLabel>
                  <IonInput type="text" name="name" required></IonInput>
                </IonItem>
              </IonRow>
              <IonRow>
                <IonItem>
                  <IonLabel position="floating">Telf</IonLabel>
                  <IonInput type="text" name="phone" required></IonInput>
                </IonItem>
              </IonRow>
              <IonRow>
                <IonItem>
                  <IonLabel position="floating">Direccion</IonLabel>
                  <IonInput type="text" name="address" required></IonInput>
                </IonItem>
              </IonRow>

              <IonRow>
                <IonButtons>
                  <IonButton expand="full" type="submit">
                    Guardar
                  </IonButton>
                  <IonButton expand="full">Cancelar</IonButton>
                </IonButtons>
              </IonRow>
            </form>
          </IonCol>
          <IonCol size="6">
            <IonRow>
              <h1>Datos de las Lozas</h1>
            </IonRow>

            {selectedFloor ? (
              <TileInfo tile={selectedFloor} />
            ) : (
              <h2>No selecciono ninguna Loza</h2>
            )}

            {selectedBorder ? (
              <TileInfo tile={selectedBorder} />
            ) : (
              <h2>No seleccionó ningun Borde</h2>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </Fragment>
  );
};

export default SaveModalContent;
