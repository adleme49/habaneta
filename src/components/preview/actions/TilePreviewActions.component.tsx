import React, { Fragment, useContext } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';

const TilePreviewActions: React.FC = () => {
  const { setShowModal } = useContext(GeneralContext);

  const handleEnviroment = () => {
    setShowModal();
  };

  return (
    <Fragment>
      <IonSegment
        onIonChange={e => console.log('Save selected', e.detail.value)}
        style={{ padding: '2rem 0rem' }}
      >
        <IonSegmentButton value="Save">
          <IonLabel>Save</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton onClick={handleEnviroment}>
          <IonLabel>Enviroment</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="delete">
          <IonLabel>Delete</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </Fragment>
  );
};

export default TilePreviewActions;
