import React, { Fragment } from 'react';
import { IonModal } from '@ionic/react';
import GalleryModalContent from './GalleryModalContent.component';
import './../Modal.css';
const GalleryModal: React.FC = () => {
  const open = true;

  const handelDismiss = () => {
    console.log(' setShowEnviromentModal();');
  };

  return (
    <Fragment>
      <IonModal
        isOpen={open}
        onDidDismiss={handelDismiss}
        cssClass="galleryModal"
      >
        <GalleryModalContent />
      </IonModal>
    </Fragment>
  );
};

export default GalleryModal;
