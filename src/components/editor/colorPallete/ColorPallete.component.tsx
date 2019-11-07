import React, { useContext, Fragment } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';

const ColorPallete: React.FC = () => {
  const { setColor } = useContext(GeneralContext);
  const handleSetColor = () => {
    setColor('blue');
  };
  const handleSetColorGreen = () => {
    setColor('green');
  };

  return (
    <Fragment>
      <IonItem button onClick={handleSetColor}>
        <IonLabel>Cambiar a azul</IonLabel>
      </IonItem>
      <IonItem button onClick={handleSetColorGreen}>
        <IonLabel>Cambiar a verde</IonLabel>
      </IonItem>
    </Fragment>
  );
};

export default ColorPallete;
