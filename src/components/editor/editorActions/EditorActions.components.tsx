import React, { Fragment } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';

const EditorActions: React.FC = () => {
  return (
    <Fragment>
      <IonSegment onIonChange={e => console.log('Pressed', e.detail.value)}>
        <IonSegmentButton value='Recent'>
          <IonLabel>Salvar a recientes</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value='Preview'>
          <IonLabel>Preview</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </Fragment>
  );
};

export default EditorActions;
