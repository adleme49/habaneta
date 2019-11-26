import React, { Fragment, useContext } from 'react';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';
import RecentContext from '../../../context/recent/recent.context';

const EditorActions: React.FC = () => {
  const { selectedTile } = useContext(GeneralContext) as any;
  const { addRecent } = useContext(RecentContext) as any;
  const handleAddtoRecent = () => {
    addRecent(selectedTile);
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
