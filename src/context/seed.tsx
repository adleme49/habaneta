import { IColor, IBorderFamily, ITileFamily } from './interfaces';

export const Border = 'Border';
export const Floor = 'Floor';

export const DomiColors: IColor[] = [
  { name: 'red', code: '#F44336' },
  { name: 'pink', code: '#E91E63' },
  { name: 'purple', code: '#9C27B0' },
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
  { name: 'darken_blue', code: '#0d47a1' },
  { name: 'darken_amber', code: '#ff6f00' },
  { name: 'white', code: 'white' },
  { name: 'black', code: 'black' }
];

export const borderFam: IBorderFamily[] = [
  {
    name: 'Victorian',
    type: Border,
    types: []
  },
  {
    name: 'Floral',
    type: Border,
    types: [
      {
        name: 'Mod. 3',
        imgUrl: '../assets/Border/Floral/l3.1.svg',
        cornerUrl: '../assets/Border/Floral/l3.2.svg',
        type: Border,
        layers: {
          st0: '#D3AC85',
          st1: '#8E2424',
          st2: '#F7EAB7',
          st3: '#5C819E'
        }
      },
      {
        name: 'Mod. 4',
        imgUrl: '../assets/Border/Floral/l4.1.svg',
        cornerUrl: '../assets/Border/Floral/l4.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#555555',
          st2: '#E4E4E4',
          st3: '#AFAFAF',
          st5: '#000000',
        }
      },
      {
        name: 'Mod. 29',
        imgUrl: '../assets/Border/Floral/l29.1.svg',
        cornerUrl: '../assets/Border/Floral/l29.2.svg',
        cornerInteriorUrl: '../assets/Border/Floral/l29.3.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#A5A5A0',
          st2: '#A0EFED',
          st3: '#B6D37F',
          st4: '#EEF2A0',
          st5: '#F9B7B7',
          st6: '#000000'
        }
      }
    ]
  }
];

export const tilesFam: ITileFamily[] = [
  {
    name: 'Traditional',
    type: Floor,
    types: [
      {
        name: 'Mod. 262B',
        imgUrl: '../assets/Tile/Contemporary/tile.svg',
        type: Floor,
        layers: {
          l1: '#d3e39d',
          l2: 'green',
          l4: 'black',
          l5: 'red'
        }
      },
      {
        name: 'Mod. l14',
        imgUrl: '../assets/Tile/Contemporary/l14.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#AF5A4B',
          st2: '#C4C3C3',
          st3: '#E5DC71',
          st4: '#020202',
          st5: '#88D1D7',
          st6: '#81CBAD',
          st7: '#91C365',
          st8: '#EEAE3D',
          st9: '#6D78B9'
        }
      }
    ]
  },
  {
    name: 'Contemporary',
    type: Floor,
    types: []
  },
  {
    name: 'Geometric',
    type: Floor,
    types: []
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

export const galleryPictures = [
  { imgUrl: '../assets/Gallery/f1.jpeg' },
  { imgUrl: '../assets/Gallery/f2.jpeg' },
  { imgUrl: '../assets/Gallery/f3.jpeg' },
  { imgUrl: '../assets/Gallery/f4.jpeg' },
  { imgUrl: '../assets/Gallery/f5.jpeg' },
  { imgUrl: '../assets/Gallery/f6.jpeg' },
  { imgUrl: '../assets/Gallery/f7.jpeg' },
  { imgUrl: '../assets/Gallery/f8.jpeg' },
  { imgUrl: '../assets/Gallery/f9.jpeg' },
  { imgUrl: '../assets/Gallery/f10.jpeg' },
  { imgUrl: '../assets/Gallery/f11.jpeg' },
  { imgUrl: '../assets/Gallery/f12.jpeg' },
  { imgUrl: '../assets/Gallery/f13.jpeg' },
  { imgUrl: '../assets/Gallery/f14.jpeg' },
  { imgUrl: '../assets/Gallery/f15.jpeg' },
  { imgUrl: '../assets/Gallery/f16.jpeg' },
  { imgUrl: '../assets/Gallery/f17.jpeg' },
  { imgUrl: '../assets/Gallery/f18.jpeg' },
  { imgUrl: '../assets/Gallery/f19.jpeg' },
  { imgUrl: '../assets/Gallery/f20.jpeg' },
  { imgUrl: '../assets/Gallery/f21.jpeg' }
];

export const colors = [
  ['#000000', '#48627d', '#5d7790', '#829db8', '#87a2bd', '#8aa4bb', '#ffffff'],
  ['#923b44', '#ad505a', '#c3707a', '#cf97a4', '#cfbdc9', '#b8b4c2', '#bdbbc0'],
  ['#3d3d49', '#585b6c', '#727888', '#a1a3b2', '#979eb0', '#a3a9b9', '#b1b8c2'],
  ['#574e4f', '#6a6260', '#7d7573', '#a2a1a6', '#b1b0b6', '#b3b6bd', '#b6bdc5'],
  ['#696353', '#6e6949', '#6f6d56', '#7f816c', '#999d8f', '#b8b9b4', '#b7bbba'],
  ['#213d86', '#355aa1', '#537db9', '#7196c3', '#9ebcd6', '#aec4d9', '#bacad7'],
  ['#2c4d70', '#2e5478', '#3f6d91', '#6d99b4', '#87adc4', '#a2bfd1', '#b8cbd9'],
  ['#bd8c6e', '#ba8e71', '#b2927d', '#b6a89b', '#bcb7b1', '#bbb6b0', '#c9c8c6'],
  ['#bc826a', '#c4907a', '#c39d89', '#c9b1a4', '#b9b6b1', '#b9bbba', '#c4c8c9'],
  ['#314977', '#255387', '#4274a7', '#719bc1', '#a6c0db', '#bbccde', '#cdd6e5'],
  ['#175d52', '#177f68', '#299989', '#56a19d', '#a1bfc1', '#c6d3d9', '#ced8da'],
  ['#3a5a55', '#3e6455', '#4f806d', '#7da99c', '#8dadaa', '#bbc9ca', '#cdd4da'],
  ['#978c76', '#a5977c', '#a0997f', '#9e9a91', '#aaaca9', '#a2acae', '#9caeba'],
  ['#0e556b', '#236b83', '#3f8398', '#6da5bc', '#7dafc8', '#87afc8', '#91aec0'],
  ['#8a786a', '#92847b', '#9f9188', '#a6a19e', '#a4a4a2', '#a6aaa9', '#9facb4']
];
