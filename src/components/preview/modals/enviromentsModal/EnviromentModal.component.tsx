import React from 'react';
import { useStore } from '../../../../store/store';
import EnviromentModalContent from './EnviromentModalContent.component';
import Modal from '../../../common/Modal.component';

export const EnviromentModal: React.FC = () => {
  const { modal, closeModals, gridImg, selectedBorder } = useStore();

  return (
    <Modal
      isOpen={modal === 'enviroment'}
      onClose={closeModals}
      className="w-[80%] h-[90%]"
    >
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
