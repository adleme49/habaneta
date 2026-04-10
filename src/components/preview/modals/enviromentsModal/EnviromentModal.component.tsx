import React, { useContext } from 'react';
import GeneralContext from '../../../../context/global/general.context';
import EnviromentModalContent from './EnviromentModalContent.component';
import RecentContext from '../../../../context/recent/recent.context';
import Modal from '../../../common/Modal.component';

export const EnviromentModal: React.FC = () => {
  const { showEnviromentModal, closeModals, gridImg } = useContext(GeneralContext);
  const { selectedBorder } = useContext(RecentContext);

  return (
    <Modal isOpen={showEnviromentModal} onClose={closeModals} className="w-[80%] h-[90%]">
      {gridImg ? (
        <EnviromentModalContent
          img={gridImg}
          onClose={closeModals}
          border={selectedBorder}
        />
      ) : null}
    </Modal>
  );
};

export default EnviromentModal;
