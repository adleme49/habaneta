import { IonImg, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import domtoimage from 'dom-to-image';
import React, { Fragment, useContext, useState } from 'react';
import GeneralContext from '../../../context/global/general.context';

const TilePreviewActions: React.FC = () => {
  const {
    setShowEnviromentModal,
    setShowSaveModal,
    setShowGalleryModal,
    saveGridImg
  } = useContext(GeneralContext);

  const domCapturer = (ModaltoOpen: Function) => {
    const grid = document.getElementById('grid');
    if (grid) {
      domtoimage.toPng(grid).then(dataUrl => {
        saveGridImg(dataUrl);
        ModaltoOpen();
      });
    }
  };

  const onEnviroment = () => {
    domCapturer(setShowEnviromentModal);
  };
  const onSave = () => {
    domCapturer(setShowSaveModal);
  };
  const onGallery = () => {
    setShowGalleryModal();
  };

  return (
    <Fragment>
      <IonSegment style={{ padding: '2rem 0rem' }}>
        <IonSegmentButton onClick={onGallery}>
          <IonLabel>Gallery</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton onClick={onEnviroment}>
          <IonLabel>Enviroment</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton onClick={onSave}>
          <IonLabel>Save</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </Fragment>
  );
};

export default TilePreviewActions;
