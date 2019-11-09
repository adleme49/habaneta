import React, { Fragment, useContext } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';

const EditorActions: React.FC = () => {
  const { setPreview, addToRecent, selectedTile } = useContext(GeneralContext);

  const handlePreview = () => {
    setPreview();
  };
  const handleAddtoRecent = () => {
    addToRecent(selectedTile);
  };

  return (
    <Fragment>
      <IonSegment>
        <IonSegmentButton onClick={handleAddtoRecent} value='Recent'>
          <IonLabel>Salvar a recientes</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value='Preview' onClick={handlePreview}>
          <IonLabel>Preview</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </Fragment>
  );
};

export default EditorActions;
