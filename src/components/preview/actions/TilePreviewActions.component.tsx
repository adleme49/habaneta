import React, { Fragment } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';

const TilePreviewActions: React.FC = () => {
  return (
    <Fragment>
      <IonSegment
        onIonChange={e => console.log('Save selected', e.detail.value)}
      >
        <IonSegmentButton value='Save'>
          <IonLabel>Save</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value='enviroment'>
          <IonLabel>Enviroment</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value='delete'>
          <IonLabel>Delete</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </Fragment>
  );
};

export default TilePreviewActions;
