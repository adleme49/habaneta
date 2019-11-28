import { IonContent, IonTitle, IonToolbar } from '@ionic/react';
import React, { Fragment } from 'react';
import 'react-awesome-slider/dist/styles.css';
import { galleryPictures } from '../../../../context/seed';
import './../Modal.css';
const AwesomeSliderStyles = require('react-awesome-slider/src/styles');
const AwesomeSlider = require('react-awesome-slider').default;
declare const require: any;

const GalleryModalContent: React.FC = () => {
  return (
    <Fragment>
      <IonContent>
        <IonToolbar color="primary">
          <IonTitle>Gallery</IonTitle>
        </IonToolbar>
        <AwesomeSlider
          className={'arrows'}
          cssModule={AwesomeSliderStyles}
          bullets={false}
          fillParent={true}
        >
          <div data-src={galleryPictures[0].imgUrl} />
          <div data-src={galleryPictures[1].imgUrl} />
          <div data-src={galleryPictures[2].imgUrl} />
        </AwesomeSlider>
      </IonContent>
    </Fragment>
  );
};

export default GalleryModalContent;
