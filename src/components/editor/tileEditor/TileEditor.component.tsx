import { IonRow } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import EditorContext from '../../../context/editor/editor.context';
import EditorActions from '../editorActions/EditorActions.components';
import SVGTilePaint from './svgTile/SVGTilePaint.component';

const TileEditor: React.FC = () => {
  const { tile, paintLayer } = useContext(EditorContext);

  const colorLayer = (layerId: string) => {
    paintLayer(layerId);
  };
  return (
    <Fragment>
      {tile ? (
        <Fragment>
          <IonRow className="ion-justify-content-center">
            <SVGTilePaint tile={tile} colorLayer={colorLayer} />
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <EditorActions />
          </IonRow>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default TileEditor;
