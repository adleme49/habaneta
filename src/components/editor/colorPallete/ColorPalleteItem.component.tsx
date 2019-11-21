import React, { useContext } from 'react';
import { IColor } from '../../../context/interfaces';
import { IonCol } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';

const ColorPalleteItem: React.FC<{ color: IColor }> = ({ color }) => {
  const { setColor } = useContext(GeneralContext);

  const handleSetColor = () => {
    setColor(color.code);
  };

  return (
    <IonCol
      size='2'
      style={{ background: color.code, height: '3rem' }}
      onClick={handleSetColor}
    ></IonCol>
  );
};

export default ColorPalleteItem;
