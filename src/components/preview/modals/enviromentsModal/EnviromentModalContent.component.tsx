import React from 'react';
import bano from '../../../../theme/bano.png';
import { IBorder } from '../../../../context/interfaces';

const EnviromentModalContent: React.FC<{
  onClose: Function;
  img: string;
  border?: IBorder;
}> = ({ img, onClose, border }) => {
  const imgStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    left: '27em',
    top: '27em',
    transform: 'perspective(1200px) rotateX(68deg)'
  };
  const imgStyleDouble: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    left: '27em',
    top: '27em',
    transform: 'perspective(1200px) rotateX(68deg) rotateZ(90deg)'
  };
  const banoStyle: React.CSSProperties = { position: 'absolute', zIndex: 2, width: '80vw' };

  return (
    <>
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Enviroments</span>
        <button onClick={() => onClose()} className="text-white text-xl">×</button>
      </div>
      <div className="w-full p-0 m-0">
        <div className="flex">
          <img src={bano} style={banoStyle} alt="environment" />
          <img
            src={img}
            style={border && border.cornerInteriorUrl ? imgStyleDouble : imgStyle}
            alt="grid"
          />
        </div>
      </div>
    </>
  );
};

export default EnviromentModalContent;
