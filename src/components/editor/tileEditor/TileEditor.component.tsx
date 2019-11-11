import { IonImg, IonRow, IonCol } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import Default from '../../../theme/102.png';
import EditorActions from '../editorActions/EditorActions.components';

const TileEditor: React.FC = () => {
  const { selectedTile } = useContext(GeneralContext);
  return (
    <Fragment>
      {selectedTile !== null ? (
        <IonRow>
          {selectedTile.imgUrl ? (
            <IonCol size='8' offset='2'>
              <IonImg src={selectedTile.imgUrl} alt={selectedTile.name} />
            </IonCol>
          ) : (
            <IonCol size='8' offset='2'>
              <IonImg src={Default} alt={selectedTile.name} />
            </IonCol>
          )}

          <IonCol size='12'>
            <EditorActions />
          </IonCol>
        </IonRow>
      ) : null}
    </Fragment>
  );
};

export default TileEditor;
