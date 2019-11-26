import { IonModal } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../../context/global/general.context';
import './../Modal.css';
import GalleryModalContent from './GalleryModalContent.component';
const GalleryModal: React.FC = () => {
  const { showGalleryModal, setShowGalleryModal } = useContext(
    GeneralContext
  ) as any;

  const handelDismiss = () => {
    setShowGalleryModal();
  };

  return (
    <Fragment>
      <IonModal
        isOpen={showGalleryModal}
        onDidDismiss={handelDismiss}
        cssClass="galleryModal"
      >
        <GalleryModalContent />
      </IonModal>
    </Fragment>
  );
};

export default GalleryModal;
