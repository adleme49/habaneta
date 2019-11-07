import React, { useState, Fragment, useContext } from 'react';
import { IonModal, IonButton, IonContent } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';

export const EnviromentModal: React.FC = () => {
  const { showModal, setShowModal } = useContext(GeneralContext);

  return (
    <Fragment>
      <IonModal isOpen={showModal} animated showBackdrop>
        <p>This is modal content</p>
        <IonButton onClick={() => setShowModal()}>Close Modal</IonButton>
      </IonModal>
    </Fragment>
  );
};

export default EnviromentModal;
