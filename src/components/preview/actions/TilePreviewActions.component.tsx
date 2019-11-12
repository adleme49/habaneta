import React, { Fragment, useContext } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';

const TilePreviewActions: React.FC = () => {
  const { setShowEnviromentModal, setShowSaveModal } = useContext(
    GeneralContext
  );

  const onEnviroment = () => {
    setShowEnviromentModal();
  };
  const onSave = () => {
    setShowSaveModal();
  };

  return (
    <Fragment>
      <IonSegment style={{ padding: '2rem 0rem' }}>
        <IonSegmentButton onClick={onSave}>
          <IonLabel>Save</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton onClick={onEnviroment}>
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
