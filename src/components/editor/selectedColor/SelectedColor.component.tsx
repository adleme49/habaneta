import { IonRow } from '@ionic/react';
import React, { Fragment, useContext } from 'react';
import EditorContext from '../../../context/editor/editor.context';
const SelectedColor: React.FC = () => {
  const { selectedColor } = useContext(EditorContext);
  return (
    <Fragment>
      <IonRow
        style={{ padding: '2.5rem 0rem' }}
        className="ion-justify-content-center"
      >
        <div
          className="border-darken-4"
          style={{
            background: `${selectedColor}`,
            height: '5rem',
            width: '5rem',
            border: 'solid 0.1rem'
          }}
        ></div>
      </IonRow>
    </Fragment>
  );
};
export default SelectedColor;
