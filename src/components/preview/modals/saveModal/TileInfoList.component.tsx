import React from 'react';
import { Dict } from '../../../../context/interfaces';
import { IonRow } from '@ionic/react';

const TileInfoList: React.FC<{ layers: Dict<string> }> = ({ layers }) => {
  const length = Object.keys(layers!).length;
  return Object.keys(layers!).length < 4 ? <h1>simple</h1> : <h2>doble</h2>;
};

export default TileInfoList;

// const SimpleList: React.FC<{ layers: any }> = ({ layers }) => {
//   return Object.keys(layers).map((key, index) => (
//     <IonRow key={index}>
//       <h1>
//         Capa {index + 1}: {layers![key].toUpperCase()}
//       </h1>
//     </IonRow>
//   ));
