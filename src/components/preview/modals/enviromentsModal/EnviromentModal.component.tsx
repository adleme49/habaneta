import React, { Fragment, useContext } from 'react';
import { IonModal } from '@ionic/react';
import GeneralContext from '../../../../context/global/general.context';
import EnviromentModalContent from './EnviromentModalContent.component';

export const EnviromentModal: React.FC = () => {
  const { showEnviromentModal, closeModals, gridImg } = useContext(
    GeneralContext
  );

  const handelDismiss = () => {
    closeModals();
  };
  return (
    <Fragment>
      <IonModal
        isOpen={showEnviromentModal}
        onDidDismiss={handelDismiss}
        cssClass="enviromentModal"
      >
        {gridImg ? (
          <EnviromentModalContent img={gridImg} onClose={handelDismiss} />
        ) : null}
      </IonModal>
    </Fragment>
  );
};

export default EnviromentModal;
