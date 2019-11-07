import React, { Fragment, useContext } from 'react';
import { IonCol } from '@ionic/react';
import GeneralContext from '../../../context/global/general.context';
const SelectedColor: React.FC = () => {
  const { selectedColor } = useContext(GeneralContext);
  return (
    <Fragment>
      <IonCol
        className='border-darken-4'
        style={{
          background: `${selectedColor}`,
          height: '5rem',
          border: 'solid 2px'
        }}
        size='3'
        offset='4'
      ></IonCol>
    </Fragment>
  );
};
export default SelectedColor;
