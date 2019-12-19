import React, { Fragment, useContext } from 'react';
import { IonModal } from '@ionic/react';
import GeneralContext from '../../../../context/global/general.context';
import EnviromentModalContent from './EnviromentModalContent.component';
import RecentContext from '../../../../context/recent/recent.context';

export const EnviromentModal: React.FC = () => {
  const { showEnviromentModal, closeModals, gridImg } = useContext(
    GeneralContext
  );
  const { selectedBorder } = useContext(RecentContext);

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
          <EnviromentModalContent
            img={gridImg}
            onClose={handelDismiss}
            border={selectedBorder}
          />
        ) : null}
      </IonModal>
    </Fragment>
  );
};

export default EnviromentModal;
