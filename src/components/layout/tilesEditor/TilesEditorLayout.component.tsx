import React, { Fragment } from "react";
import { IonRow } from "@ionic/react";
import GeneralState from "../../../context/editor/editor.state";
import SelectedColor from "../../editor/selectedColor/SelectedColor.component";
import ColorPallete from "../../editor/colorPallete/ColorPallete.component";
import TileEditor from "../../editor/tileEditor/TileEditor.component";

const TilesEditorLayout: React.FC = () => {
  return (
    <Fragment>
      <GeneralState>
        <IonRow>
          <h2>Editor</h2>
        </IonRow>

        <ColorPallete />

        <IonRow align-items-center>
          <SelectedColor />
        </IonRow>
        <IonRow>
          <TileEditor />
        </IonRow>
      </GeneralState>
    </Fragment>
  );
};

export default TilesEditorLayout;
