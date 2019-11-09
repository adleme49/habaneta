import { IonImg, IonRow, IonCol } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import border from '../../../theme/border.png';
import EditorActions from '../editorActions/EditorActions.components';

const TileEditor: React.FC = () => {
  const { selectedTile } = useContext(GeneralContext);
  return (
    <Fragment>
      {selectedTile !== null ? (
        <IonRow>
          <IonCol size='8' offset='2'>
            <IonImg src={border} alt={selectedTile.name} />
          </IonCol>
          <IonCol size='12'>
            <EditorActions />
          </IonCol>
        </IonRow>
      ) : null}
    </Fragment>
  );
};

export default TileEditor;
