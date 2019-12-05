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
        name: 'Mod. 29',
        imgUrl: '../assets/Border/Floral/l29.1.svg',
        cornerUrl: '../assets/Border/Floral/l29.3.svg',
        cornerInteriorUrl: '../assets/Border/Floral/l29.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#A5A5A0',
          st2: '#A0EFED',
          st3: '#B6D37F',
          st4: '#EEF2A0',
          st5: '#F9B7B7'
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
