import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  IonImg
} from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import RecentContext from '../../../../context/recent/recent.context';
import TileInfo from './TileInfo.component';

const SaveModalContent: React.FC<{
  onClose: Function;
  gridImg: string | undefined;
}> = ({ onClose, gridImg }) => {
  const { selectedBorder, selectedFloor } = useContext(RecentContext);

  const handelDismiss = () => {
    onClose();
  };

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

      <IonGrid fixed={true} style={{ width: '90%' }}>
        <form onSubmit={onSubmitForm}>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Nombre</IonLabel>
                <IonInput type="text" name="name" required></IonInput>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Telf</IonLabel>
                <IonInput type="text" name="phone" required></IonInput>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Habitacion</IonLabel>
                <IonInput type="text" name="room" required></IonInput>
              </IonItem>
            </IonCol>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Metros Cuadrados</IonLabel>
                <IonInput type="text" name="m2" required></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
        </form>
        <IonRow>
          <IonCol size="6" style={{ width: '100%' }}>
            {gridImg ? <IonImg src={gridImg}></IonImg> : null}
          </IonCol>
          <IonCol size="6">
            <IonRow>
              {selectedFloor ? (
                <TileInfo tile={selectedFloor} />
              ) : (
                <IonText>
                  <h2>No selecciono ninguna Loza</h2>
                </IonText>
              )}
            </IonRow>
            <IonRow>
              {selectedBorder ? (
                <TileInfo tile={selectedBorder} />
              ) : (
                <IonText>
                  <h2>No seleccionó ningun Borde</h2>
                </IonText>
              )}
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonButtons>
            <IonButton expand="full" type="submit">
              Guardar
            </IonButton>
            <IonButton expand="full">Cancelar</IonButton>
          </IonButtons>
        </IonRow>
      </IonGrid>
    </Fragment>
  );
};

export default SaveModalContent;
