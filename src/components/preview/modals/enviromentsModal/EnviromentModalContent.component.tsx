import {
  IonButton,
  IonButtons,
  IonGrid,
  IonIcon,
  IonImg,
  IonRow,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { Fragment } from 'react';
import bano from '../../../../theme/bano.png';
const EnviromentModalContent: React.FC<{ img: string; onClose: Function }> = ({
  img,
  onClose
}) => {
  const handelDismiss = () => {
    onClose();
  };

  const imgStyle = {
    position: 'relative',
    zIndex: '1',
    left: '27em',
    top: '27em',
    transform: 'perspective(1200px) rotateX(68deg)'
  };
  // const ImgStyleDouble = {
  //   position: 'relative',
  //   zIndex: '1',
  //   left: '27em',
  //   top: '27em',
  //   transform: 'perspective(1200px) rotateX(68deg) rotateZ(90deg)'
  // };
  const banoStyle = { position: 'absolute', zIndex: '2', width: '80vw' };
  return (
    <Fragment>
      <IonToolbar color="primary">
        <IonTitle>Enviroments</IonTitle>
        <IonButtons slot="secondary">
          <IonButton onClick={handelDismiss}>
            <IonIcon name="close" slot="icon-only" />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <IonGrid
        fixed={true}
        style={{ width: '100%' }}
        className="ion-no-padding ion-no-margin"
      >
        <IonRow>
          <IonImg src={bano} style={banoStyle} />
          <IonImg src={img} style={imgStyle} />
        </IonRow>
      </IonGrid>
    </Fragment>
  );
};

export default EnviromentModalContent;
