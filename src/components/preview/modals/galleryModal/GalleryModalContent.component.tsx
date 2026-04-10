import React from 'react';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import { galleryPictures } from '../../../../context/seed';

const GalleryModalContent: React.FC<{ onClose: Function }> = ({ onClose }) => {
  return (
    <>
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Gallery</span>
        <button onClick={() => onClose()} className="text-white text-xl">×</button>
      </div>
      <div className="h-[calc(100%-3rem)]">
        <AwesomeSlider
          className="aws-btn"
          bullets={false}
          fillParent={true}
          transitionDelay={2}
        >
          {galleryPictures.map(({ imgUrl }, i) => (
            <div data-src={imgUrl} key={i} />
          ))}
        </AwesomeSlider>
      </div>
    </>
  );
};

export default GalleryModalContent;
