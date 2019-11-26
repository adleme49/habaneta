import { IColor, IBorderFamily, ITileFamily } from './interfaces';

export const Border = 'Border';
export const Floor = 'Floor';

export const DomiColors: IColor[] = [
  { name: 'red', code: '#F44336' },
  { name: 'pink', code: '#E91E63' },
  { name: 'purple', code: '#9C27B0' },
  { name: 'deeppurple', code: '#673AB7' },
  { name: 'indigo', code: '#3F51B5' },
  { name: 'blue', code: '#2196F3' },
  { name: 'lightblue', code: '#03A9F4' },
  { name: 'cyan', code: '#00BCD4' },
  { name: 'teal', code: '#009688' },
  { name: 'green', code: '#4CAF50' },
  { name: 'lightgreen', code: '#8BC34A' },
  { name: 'lime', code: '#CDDC39' },
  { name: 'yellow', code: '#FFEB3B' },
  { name: 'amber', code: '#FFC107' },
  { name: 'orange', code: '#FF9800' },
  { name: 'deeporange', code: '#FF5722' },
  { name: 'brown', code: '#795548' },
  { name: 'grey', code: '#9E9E9E' },
  { name: 'bluegrey', code: '#607D8B' },
  { name: 'darken_red', code: '#b71c1c' },
  { name: 'darken_pink', code: '#880e4f' },
  { name: 'darken_purple', code: '#4a148c' },
  { name: 'darken_blue', code: '#0d47a1' },
  { name: 'darken_amber', code: '#ff6f00' }
];

export const borderFam: IBorderFamily[] = [
  {
    name: 'Victorian',
    type: Border,
    types: [
      { name: 'Mod. c66', imgUrl: '../assets/Border/Victorian/c66.png' },
      { name: 'Mod. c57', imgUrl: '../assets/Border/Victorian/c57.png' },
      { name: 'Mod. V2' },
      { name: 'Mod. c28', imgUrl: '../assets/Border/Victorian/c28.png' },
      { name: 'Mod. c6', imgUrl: '../assets/Border/Victorian/c6.png' },
      { name: 'Mod. V1' },
      { name: 'Mod. c4', imgUrl: '../assets/Border/Victorian/c4.png' },
      { name: 'Mod. V3' }
    ]
  },
  {
    name: 'Floral',
    type: Border,
    types: [
      { name: 'Mod. c33', imgUrl: '../assets/Border/Floral/c33.png' },
      { name: 'Mod. c32', imgUrl: '../assets/Border/Floral/c32.png' },
      { name: 'Mod. c30', imgUrl: '../assets/Border/Floral/c30.png' },
      { name: 'Mod. c27', imgUrl: '../assets/Border/Floral/c27.png' },
      { name: 'Mod. c24', imgUrl: '../assets/Border/Floral/c24.png' },
      { name: 'Mod. c21', imgUrl: '../assets/Border/Floral/c21.png' },
      { name: 'Mod. c19', imgUrl: '../assets/Border/Floral/c19.png' },
      { name: 'Mod. c17', imgUrl: '../assets/Border/Floral/c17.png' },
      { name: 'Mod. c15', imgUrl: '../assets/Border/Floral/c15.png' },
      { name: 'Mod. c3', imgUrl: '../assets/Border/Floral/c3.png' }
    ]
  },
  {
    name: 'Traditional BorderA',
    type: Border,
    types: [
      { name: 'TraditionalB 1' },
      { name: 'TraditionalB 2' },
      { name: 'TraditionalB 3' },
      { name: 'TradB 2' },
      { name: 'TradB 3' },
      { name: 'Trad 2' }
    ]
  }
];

export const tilesFam: ITileFamily[] = [
  {
    name: 'Traditional',
    type: Floor,
    types: [
      {
        name: 'Mod. 267',
        imgUrl: '../assets/Tile/Contemporary/tile.svg',
        layers: {
          l1: 'red',
          l2: 'green',
          l3: 'blue',
          l4: 'black',
          l5: 'gray',
        }
      },
      { name: 'Mod. 248', imgUrl: '../assets/Tile/Traditional/248.png' },
      { name: 'Mod. 127', imgUrl: '../assets/Tile/Traditional/127.png' },
      { name: 'Mod. 165', imgUrl: '../assets/Tile/Traditional/165.png' },
      { name: 'Mod. 143', imgUrl: '../assets/Tile/Traditional/143.png' },
      { name: 'Mod. 137', imgUrl: '../assets/Tile/Traditional/137.png' }
    ]
  },
  {
    name: 'Contemporary',
    type: Floor,
    types: [
      { name: 'Mod. 129', imgUrl: '../assets/Tile/Contemporary/129.png' },
      { name: 'Mod. 128', imgUrl: '../assets/Tile/Contemporary/128.png' },
      { name: 'Mod. 114' },
      { name: 'Mod. 124', imgUrl: '../assets/Tile/Contemporary/124.png' },
      { name: 'Mod. 117', imgUrl: '../assets/Tile/Contemporary/117.png' },
      { name: 'Mod. 116', imgUrl: '../assets/Tile/Contemporary/116.png' },
      { name: 'Mod. 115', imgUrl: '../assets/Tile/Contemporary/115.png' },
      { name: 'Mod. 110', imgUrl: '../assets/Tile/Contemporary/110.png' },
      { name: 'Mod. 101', imgUrl: '../assets/Tile/Contemporary/101.png' }
    ]
  },
  {
    name: 'Geometric',
    type: Floor,
    types: [
      { name: 'Mod. 167', imgUrl: '../assets/Tile/Geometric/167.png' },
      { name: 'Mod. 148', imgUrl: '../assets/Tile/Geometric/148.png' },
      { name: 'Mod. 144', imgUrl: '../assets/Tile/Geometric/144.png' },
      { name: 'Mod. 135', imgUrl: '../assets/Tile/Geometric/135.png' },
      { name: 'Mod. 123', imgUrl: '../assets/Tile/Geometric/123.png' },
      { name: 'Mod. 121', imgUrl: '../assets/Tile/Geometric/121.png' },
      { name: 'Mod. 111', imgUrl: '../assets/Tile/Geometric/111.png' },
      { name: 'Mod. 112', imgUrl: '../assets/Tile/Geometric/112.png' },
      { name: 'Mod. 105', imgUrl: '../assets/Tile/Geometric/105.png' },
      { name: 'Mod. 103', imgUrl: '../assets/Tile/Geometric/103.png' },
      { name: 'Geometric 1' }
    ]
  }
];

export const recent = [
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' }
];
