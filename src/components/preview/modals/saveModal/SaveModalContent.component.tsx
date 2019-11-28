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
  IonToolbar
} from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import RecentContext from '../../../../context/recent/recent.context';
import SVGTile from '../../../common/SVGTile.component';

const SaveModalContent: React.FC = () => {
  const { selectedBorder, selectedFloor } = useContext(RecentContext);
  // const initialClient = { name: '', phone: '', address: '' };
  // const [client, setClient] = useState(initialClient);
  // const { name, phone, address } = client;

  const onSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event.timeStamp);
  };

  return (
    <Fragment>
      <IonToolbar color="primary">
        <IonTitle>Save</IonTitle>
      </IonToolbar>

      <IonGrid fixed>
        <IonRow>
          <IonCol align-self-center size="6">
            <form onSubmit={onSubmitForm}>
              <IonRow>
                <h1>Datos del Cliente</h1>

                <IonItem>
                  <IonLabel position="floating">Nombre</IonLabel>
                  <IonInput type="text" name="name" required></IonInput>

                  {/* <input
                    className="ion-input"
                    type="text"
                    name="name"
                    value={name}
                    required
                    onChange={handleChange}
                  /> */}
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Telf</IonLabel>
                  <IonInput type="text" name="phone" required></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position="floating">Direccion</IonLabel>
                  <IonInput type="text" name="address" required></IonInput>
                </IonItem>
              </IonRow>

              <IonButtons>
                <IonButton expand="full" type="submit">
                  Guardar
                </IonButton>
                <IonButton expand="full">Cancelar</IonButton>
              </IonButtons>
            </form>
          </IonCol>
          <IonCol align-self-center size="6">
            <IonRow align-items-end>
              {selectedFloor ? (
                <SVGTile tile={selectedFloor} height={230} width={230} />
              ) : (
                <h2>No selecciono ninguna Loza</h2>
              )}
            </IonRow>
            <IonRow align-items-end>
              {selectedBorder ? (
                <SVGTile tile={selectedBorder} height={230} width={230} />
              ) : (
                <h2>No seleccionó ningun Borde</h2>
              )}
            </IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    </Fragment>
  );
};

export default SaveModalContent;
