import { IonRow, IonCol } from "@ionic/react";
import React, { Fragment, useContext } from "react";
import EditorContext from "../../../context/editor/editor.context";
import EditorActions from "../editorActions/EditorActions.components";
import SVGTile from "./svgTile/SVGTile.component";

const TileEditor: React.FC = () => {
  const { tile, paintLayer } = useContext(EditorContext);

  const colorLayer = (layerId: string) => paintLayer(layerId);

  return (
    <Fragment>
      {tile ? (
        <IonRow>
          <IonCol size="8" offset="2">
            <SVGTile tile={tile} colorLayer={colorLayer} />
          </IonCol>

          <IonCol size="12">
            <EditorActions />
          </IonCol>
        </IonRow>
      ) : null}
    </Fragment>
  );
};

export default TileEditor;

// {selectedTile.imgUrl ? (
//   <IonCol size='8' offset='2'>
//     <IonImg src={selectedTile.imgUrl} alt={selectedTile.name} />
//   </IonCol>
// ) : (
//   <IonCol size='8' offset='2'>
//     <IonImg src={Default} alt={selectedTile.name} />
//   </IonCol>
// )}
