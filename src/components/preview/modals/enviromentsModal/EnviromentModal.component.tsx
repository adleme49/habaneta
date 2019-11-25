import React, { Fragment, useContext } from 'react';
import { IonModal } from '@ionic/react';
import GeneralContext from '../../../../context/global/general.context';
import EnviromentModalContent from './EnviromentModalContent.component';

export const EnviromentModal: React.FC = () => {
  const { showEnviromentModal, setShowEnviromentModal } = useContext(
    GeneralContext
  ) as any;

  const handelDismiss = () => {
    setShowEnviromentModal();
  };

  return (
    <Fragment>
      <IonModal isOpen={showEnviromentModal} onDidDismiss={handelDismiss}>
        <EnviromentModalContent />
      </IonModal>
    </Fragment>
  );
};

export default EnviromentModal;
