import React, { Fragment } from 'react';
import { IonModal } from '@ionic/react';
import SaveModalContent from './SaveModalContent.component';

const SaveModal: React.FC = () => {
  const handelDismiss = () => {
    console.log('Dismiss');
  };

  return (
    <Fragment>
      <IonModal isOpen={false} onDidDismiss={handelDismiss}>
        <SaveModalContent />
      </IonModal>
    </Fragment>
  );
};

export default SaveModal;
