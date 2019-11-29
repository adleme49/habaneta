import React, { Fragment, useContext } from 'react';
import {
  IonContent,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/react';
import 'react-awesome-slider/dist/styles.css';
import { galleryPictures } from '../../../../context/seed';
import './../Modal.css';
import GeneralContext from '../../../../context/global/general.context';
const AwesomeSliderStyles = require('react-awesome-slider/src/styles');
const AwesomeSlider = require('react-awesome-slider').default;
declare const require: any;

const GalleryModalContent: React.FC<{ onDismiss?: Function }> = ({}) => {
  const { closeModals } = useContext(GeneralContext);

  const handelDismiss = () => {
    closeModals();
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
          cssModule={AwesomeSliderStyles}
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
