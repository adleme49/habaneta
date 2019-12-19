import React, { Fragment, useContext } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import RecentContext from '../../../context/recent/recent.context';
import EditorContext from '../../../context/editor/editor.context';

const EditorActions: React.FC = () => {
  const { tile } = useContext(EditorContext);
  const { addRecent } = useContext(RecentContext);
  const handleAddtoRecent = () => {
    if (tile) {
      addRecent(tile);
    }
  };
  return (
    <Fragment>
      <IonSegment style={{ paddingTop: '3em' }}>
        <IonSegmentButton onClick={handleAddtoRecent} value="Recent">
          <IonLabel>Salvar a recientes</IonLabel>
        </IonSegmentButton>
      </IonSegment>
    </Fragment>
  );
};

export default EditorActions;
