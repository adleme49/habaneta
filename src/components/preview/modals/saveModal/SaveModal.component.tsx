import React, { useContext } from 'react';
import SaveModalContent from './SaveModalContent.component';
import GeneralContext from '../../../../context/global/general.context';
import Modal from '../../../common/Modal.component';

const SaveModal: React.FC = () => {
  const { showSaveModal, closeModals, gridImg } = useContext(GeneralContext);

  return (
    <Modal isOpen={showSaveModal} onClose={closeModals} className="w-full h-full">
      <SaveModalContent onClose={closeModals} gridImg={gridImg} />
    </Modal>
  );
};

export default SaveModal;
