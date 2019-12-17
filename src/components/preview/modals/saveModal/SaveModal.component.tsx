import React, { Fragment, useContext } from 'react';
import { IonModal, IonContent } from '@ionic/react';
import SaveModalContent from './SaveModalContent.component';
import GeneralContext from '../../../../context/global/general.context';
import './../Modal.css';

const SaveModal: React.FC = () => {
  const { showSaveModal, closeModals } = useContext(GeneralContext);

  const handelDismiss = () => {
    closeModals();
  };

  return (
    <Fragment>
      <IonContent>
        <IonModal
          isOpen={showSaveModal}
          // isOpen={true}
          onDidDismiss={handelDismiss}
          cssClass="saveModal"
        >
          <SaveModalContent onClose={handelDismiss} />
        </IonModal>
      </IonContent>
    </Fragment>
  );
};

export default SaveModal;
