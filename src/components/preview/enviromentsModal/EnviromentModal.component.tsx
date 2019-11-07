import React, { Fragment, useContext } from 'react';
import { IonModal } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';
import EnviromentModalContent from './EnviromentModalContent.component';

export const EnviromentModal: React.FC = () => {
  const { showModal, setShowModal } = useContext(GeneralContext);

  const handelDismiss = () => {
    setShowModal();
  };

  return (
    <Fragment>
      <IonModal
        isOpen={showModal}
        animated
        showBackdrop
        onDidDismiss={handelDismiss}
      >
        <EnviromentModalContent />
      </IonModal>
    </Fragment>
  );
};

export default EnviromentModal;
