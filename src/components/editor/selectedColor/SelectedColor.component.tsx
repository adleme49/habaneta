import React, { Fragment, useContext } from 'react';
import { IonCol } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';
const SelectedColor: React.FC = () => {
  const { selectedColor } = useContext(GeneralContext);
  return (
    <Fragment>
      <IonCol size="2" style={{ padding: '1.5rem 0rem' }}>
        <div
          className="border-darken-4"
          style={{
            background: `${selectedColor}`,
            height: '3rem',
            width: '100%',
            border: 'solid 0.1rem'
          }}
        ></div>
      </IonCol>
    </Fragment>
  );
};
export default SelectedColor;
