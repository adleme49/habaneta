import React, { Fragment, useContext } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';

const TilePreviewActions: React.FC = () => {
  const { setShowEnviromentModal, setShowSaveModal } = useContext(
    GeneralContext
  ) as any;

  const onEnviroment = () => {
    setShowEnviromentModal();
  };
  const onSave = () => {
    setShowSaveModal();
  };

  return (
    <Fragment>
      <IonSegment style={{ padding: '2rem 0rem' }}>
        <IonSegmentButton onClick={onEnviroment}>
          <IonLabel>Enviroment</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton onClick={onSave}>
          <IonLabel>Save</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </Fragment>
  );
};

export default TilePreviewActions;
