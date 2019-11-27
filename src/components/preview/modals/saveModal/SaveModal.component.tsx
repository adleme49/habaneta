import React, { Fragment, useContext } from 'react';
import { IonModal, IonContent } from '@ionic/react';
import SaveModalContent from './SaveModalContent.component';
import GeneralContext from '../../../../context/global/general.context';
import './../Modal.css';

const SaveModal: React.FC = () => {
  const { showSaveModal, setShowSaveModal } = useContext(GeneralContext);

  const handelDismiss = () => {
    setShowSaveModal();
  };

  return (
    <Fragment>
      <IonContent>
        <IonModal
          isOpen={showSaveModal}
          onDidDismiss={handelDismiss}
          cssClass="saveModal"
        >
          <SaveModalContent />
        </IonModal>
      </IonContent>
    </Fragment>
  );
};

export default SaveModal;
