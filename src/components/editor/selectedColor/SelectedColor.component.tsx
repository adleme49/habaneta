import React, { Fragment, useContext } from 'react';
import { IonCol } from '@ionic/react';
import EditorContext from '../../../context/editor/editor.context';
const SelectedColor: React.FC = () => {
  const { selectedColor } = useContext(EditorContext);
  return (
    <Fragment>
      <IonCol size='3' offset='4'>
        <div
          className='border-darken-4'
          style={{
            background: `${selectedColor}`,
            height: '5rem',
            border: 'solid 2px',
            margin: '1rem 0rem'
          }}
        ></div>
      </IonCol>
    </Fragment>
  );
};
export default SelectedColor;
