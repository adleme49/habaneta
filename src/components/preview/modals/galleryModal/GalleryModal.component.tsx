import React from 'react';
import { useStore } from '../../../../store/store';
import GalleryModalContent from './GalleryModalContent.component';
import Modal from '../../../common/Modal.component';

const GalleryModal: React.FC = () => {
  const { modal, closeModals } = useStore();

  return (
    <Modal
      isOpen={modal === 'gallery'}
      onClose={closeModals}
      className="w-full h-full"
    >
      <GalleryModalContent onClose={closeModals} />
    </Modal>
  );
};

export default GalleryModal;
