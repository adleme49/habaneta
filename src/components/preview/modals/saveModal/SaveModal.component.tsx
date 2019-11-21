import React, { Fragment, useContext } from 'react';
import { IonModal } from '@ionic/react';
import SaveModalContent from './SaveModalContent.component';
import GeneralContext from '../../../../context/global/general.context';

const SaveModal: React.FC = () => {
  const { showSaveModal, setShowSaveModal } = useContext(GeneralContext);

  const handelDismiss = () => {
    setShowSaveModal();
    console.log('Dismiss');
  };

  return (
    <Fragment>
      <IonModal isOpen={showSaveModal} onDidDismiss={handelDismiss}>
        <SaveModalContent />
      </IonModal>
    </Fragment>
  );
};

export default SaveModal;
