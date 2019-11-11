import { IColor, IBorderFamily, ITileFamily, IFloor } from './interfaces';

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
  { name: 'bluegrey', code: '#607D8B' }
];

export const borderFamilys: IBorderFamily[] = [
  {
    name: 'Traditional Border',
    types: [
      { name: 'TraditionalB 1' },
      { name: 'TraditionalB 2' },
      { name: 'TraditionalB 3' },
      { name: 'TraditionalB 4' }
    ]
  },
  {
    name: 'Traditional Border1',
    types: [{ name: 'TraditionalB 1' }, { name: 'TraditionalB 2' }]
  }
];

export const tilesFamilys: ITileFamily[] = [
  {
    name: 'Traditional',
    types: [
      { name: 'Traditional 1' },
      { name: 'Traditional 2' },
      { name: 'Traditional 4' }
    ]
  },
  {
    name: 'Contemporary',
    types: [
      { name: 'Contemporary 1' },
      { name: 'Contemporary 2' },
      { name: 'Contemporary 3' },
      { name: 'Contemporary 4' },
      { name: 'Contemporary 5' },
      { name: 'Contemporary 6' },
      { name: 'Contemporary 7' },
      { name: 'Contemporary 8' },
      { name: 'Contemporary 9' },
      { name: 'Contemporary 10' },
      { name: 'Contemporary 11' },
      { name: 'Contemporary 12' }
    ]
  },
  {
    name: 'Contemporary A',
    types: [
      { name: 'Contemporary 1' },
      { name: 'Contemporary 2' },
      { name: 'Contemporary 3' },
      { name: 'Contemporary 4' },
      { name: 'Contemporary 5' },
      { name: 'Contemporary 6' },
      { name: 'Contemporary 7' },
      { name: 'Contemporary 8' },
      { name: 'Contemporary 9' },
      { name: 'Contemporary 10' },
      { name: 'Contemporary 11' },
      { name: 'Contemporary 12' }
    ]
  }
];

export const recentsUsed = [
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' },
  { name: 'empty' }
];
