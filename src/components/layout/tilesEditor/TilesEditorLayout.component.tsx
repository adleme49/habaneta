import React, { Fragment } from 'react';
import { IonRow } from '@ionic/react';
import SelectedColor from '../../editor/selectedColor/SelectedColor.component';
import ColorPallete from '../../editor/colorPallete/ColorPallete.component';
import TileEditor from '../../editor/tileEditor/TileEditor.component';

const TilesEditorLayout: React.FC = () => {
  return (
    <Fragment>
      <IonRow>
        <h2>Editor</h2>
      </IonRow>
      <IonRow>
        <ColorPallete />
      </IonRow>
      <IonRow align-items-center>
        <SelectedColor />
      </IonRow>
      <IonRow>
        <TileEditor />
      </IonRow>
    </Fragment>
  );
};

export default TilesEditorLayout;
