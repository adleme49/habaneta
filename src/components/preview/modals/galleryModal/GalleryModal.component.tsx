import React, { useContext } from 'react';
import GeneralContext from '../../../../context/global/general.context';
import GalleryModalContent from './GalleryModalContent.component';
import Modal from '../../../common/Modal.component';

const GalleryModal: React.FC = () => {
  const { showGalleryModal, closeModals } = useContext(GeneralContext);

  return (
    <Modal isOpen={showGalleryModal} onClose={closeModals} className="w-full h-full">
      <GalleryModalContent onClose={closeModals} />
    </Modal>
  );
};

export default GalleryModal;
