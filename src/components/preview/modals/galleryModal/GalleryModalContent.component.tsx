import React, { useState } from 'react';
import { galleryPictures } from '../../../../lib/gallery';

const GalleryModalContent: React.FC<{ onClose: Function }> = ({ onClose }) => {
  const [index, setIndex] = useState(0);
  const total = galleryPictures.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <>
      <div className="bg-blue-500 text-white px-4 py-2 flex justify-between items-center">
        <span className="font-semibold">Gallery</span>
        <button onClick={() => onClose()} className="text-white text-xl">
          ×
        </button>
      </div>
      <div className="relative h-[calc(100%-3rem)] bg-black flex items-center justify-center">
        <img
          src={galleryPictures[index].imgUrl}
          alt={`Gallery ${index + 1}`}
          className="max-h-full max-w-full object-contain"
        />
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center text-2xl shadow"
          aria-label="Next"
        >
          ›
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded text-sm">
          {index + 1} / {total}
        </div>
      </div>
    </>
  );
};

export default GalleryModalContent;
