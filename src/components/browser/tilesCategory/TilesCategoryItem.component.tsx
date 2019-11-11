import React, { useContext } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { IBorderFamily, ITileFamily } from '../../../context/interfaces';
import GeneralContext from '../../../context/global/general.context';

const CategoryItem: React.FC<{
  categoryItem: IBorderFamily | ITileFamily;
}> = ({ categoryItem }) => {
  const { setCurrentFamily } = useContext(GeneralContext);

  const handleClick = () => {
    setCurrentFamily(categoryItem);
  };

  return (
    <IonItem button onClick={handleClick}>
      <IonLabel>{categoryItem.name}</IonLabel>
    </IonItem>
  );
};

export default CategoryItem;
