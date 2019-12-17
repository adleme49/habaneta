import { IonImg, IonLabel, IonSegment, IonSegmentButton } from '@ionic/react';
import domtoimage from 'dom-to-image';
import React, { Fragment, useContext, useState } from 'react';
import GeneralContext from '../../../context/global/general.context';

const TilePreviewActions: React.FC = () => {
  const {
    setShowEnviromentModal,
    setShowSaveModal,
    setShowGalleryModal
  } = useContext(GeneralContext);

  const [img, setimg] = useState('');
  const domCapturer = () => {
    const grid = document.getElementById('test2');
    const options = {
      background: 'green',
      height: 750,
      width: 1250,
      style: { transform: 'rotate(20deg) ' }
    };
    console.log(grid);
    if (grid) {
      domtoimage.toPng(grid, options).then(dataUrl => {
        console.log(dataUrl);
        setimg(dataUrl);
      });
    }
  };

  const onEnviroment = () => {
    domCapturer();
    // setShowEnviromentModal();
  };
  const onSave = () => {
    setShowSaveModal();
  };
  const onGallery = () => {
    setShowGalleryModal();
  };

  return (
    <Fragment>
      <IonSegment style={{ padding: '2rem 0rem' }}>
        <IonSegmentButton onClick={onGallery}>
          <IonLabel>Gallery</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton onClick={onEnviroment}>
          <IonLabel>Enviroment</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton onClick={onSave}>
          <IonLabel>Save</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      {img ? <IonImg src={img} /> : null}
    </Fragment>
  );
};

export default TilePreviewActions;
