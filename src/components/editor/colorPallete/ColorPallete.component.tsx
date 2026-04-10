import { IonRow } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import EditorContext from '../../../context/editor/editor.context';
import { SwatchesPicker } from 'react-color';

const ColorPallete: React.FC = () => {
  const { colors } = useContext(GeneralContext);
  const { setColor } = useContext(EditorContext);

  const handleSetColor = (color: any) => {
    setColor(color.hex);
  };

  return (
    <Fragment>
      <div style={{ border: 'solid 2px black', width:"450px" }}>
        <IonRow>
          <SwatchesPicker colors={colors} width="450px" onChange={handleSetColor} />
        </IonRow>
      </div>
    </Fragment>
  );
};

export default ColorPallete;
