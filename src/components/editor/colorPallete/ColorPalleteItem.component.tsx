import React, { useContext } from 'react';
import { IonCol } from '@ionic/react';
import { IColor } from '../../../context/interfaces';
import EditorContext from '../../../context/editor/editor.context';

const ColorPalleteItem: React.FC<{ color: IColor }> = ({ color }) => {
  const { setColor } = useContext(EditorContext);

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
