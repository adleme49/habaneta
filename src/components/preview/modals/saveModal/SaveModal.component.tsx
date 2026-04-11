import React from 'react';
import SaveModalContent from './SaveModalContent.component';
import { useStore } from '../../../../store/store';
import Modal from '../../../common/Modal.component';

const SaveModal: React.FC = () => {
  const { modal, closeModals, gridImg } = useStore();

  return (
    <Modal
      isOpen={modal === 'save'}
      onClose={closeModals}
      className="w-full h-full"
    >
      <SaveModalContent onClose={closeModals} gridImg={gridImg} />
    </Modal>
  );
};

export default SaveModal;
