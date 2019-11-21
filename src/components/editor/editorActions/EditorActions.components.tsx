import React, { Fragment, useContext } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';

const EditorActions: React.FC = () => {
  const { addToRecent, selectedTile } = useContext(GeneralContext);
  const handleAddtoRecent = () => {
    addToRecent(selectedTile);
  };
  return (
    <Fragment>
      <IonSegment>
        <IonSegmentButton onClick={handleAddtoRecent} value='Recent'>
          <IonLabel>Salvar a recientes</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </Fragment>
  );
};

export default EditorActions;
