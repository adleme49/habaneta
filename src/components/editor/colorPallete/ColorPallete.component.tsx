import { IonCol, IonRow } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import GeneralContext from '../../../context/global/general.context';
import { IColor } from '../../../context/interfaces';
import ColorPalleteItem from './ColorPalleteItem.component';

const ColorPallete: React.FC = () => {
  const { colors } = useContext(GeneralContext);

  return (
    <Fragment>
      <div style={{ border: 'solid 2px black' }}>
        <IonRow>
          {colors.map((color: IColor) => (
            <ColorPalleteItem key={color.code} color={color} />
          ))}
        </IonRow>
      </div>
    </Fragment>
  );
};

export default ColorPallete;
