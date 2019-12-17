import React, { Fragment } from 'react';
import {
  IonToolbar,
  IonTitle,
  IonImg,
  IonButton,
  IonButtons,
  IonIcon,
  IonRow,
  IonGrid,
  IonCol
} from '@ionic/react';
import bano from '../../../../theme/bano.png';
import { transform } from '@babel/core';
const EnviromentModalContent: React.FC<{ img: string; onClose: Function }> = ({
  img,
  onClose
}) => {
  const handelDismiss = () => {
    onClose();
  };

  const imgStyle = {
    position: 'relative',
    width: '60%',
    zIndex: '1',
    left: '13em',
    top: '16em',
    transform: 'rotateX(72deg) rotateY(-1deg) rotateZ(3deg) skewX(3deg)'
  };
  const banoStyle = { position: 'absolute', zIndex: '2' };
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
      <IonGrid>
        <IonRow>
          <IonCol size="12">
            {/* <div
              style={{
                backgroundImage: `url(${img})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
              }}
            ></div> */}
            <div style={{ position: 'relative' }}>
              <IonImg src={bano} style={banoStyle} />
              <IonImg src={img} style={imgStyle} />
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </Fragment>
  );
};

export default EnviromentModalContent;
