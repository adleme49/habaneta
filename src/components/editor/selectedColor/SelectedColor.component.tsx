import React, { Fragment, useContext } from 'react';
import { IonCol } from '@ionic/react';
import EditorContext from '../../../context/editor/editor.context';
const SelectedColor: React.FC = () => {
  const { selectedColor } = useContext(EditorContext);
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
