import React from 'react';

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children?: React.ReactNode;
}> = ({ isOpen, onClose, className, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-white rounded-lg shadow-xl overflow-auto ${className || 'w-[80%] h-[90%]'}`}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
