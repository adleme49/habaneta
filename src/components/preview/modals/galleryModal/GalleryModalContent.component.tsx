import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/react';
import React, { Fragment } from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { galleryPictures } from '../../../../context/seed';
import './../Modal.css';

const GalleryModalContent: React.FC<{ onClose: Function }> = ({ onClose }) => {
  const handelDismiss = () => {
    onClose();
  };

  return (
    <Fragment>
      <IonContent>
        <IonToolbar color="primary">
          <IonTitle>Gallery</IonTitle>
          <IonButtons slot="secondary">
            <IonButton onClick={handelDismiss}>
              <IonIcon name="close" slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <AwesomeSlider
          className="aws-btn"
          bullets={false}
          fillParent={true}
          transitionDelay={2}
        >
          {galleryPictures.map(({ imgUrl }, i) => (
            <div data-src={imgUrl} key={i} />
          ))}
        </AwesomeSlider>
      </IonContent>
    </Fragment>
  );
};

export default GalleryModalContent;
