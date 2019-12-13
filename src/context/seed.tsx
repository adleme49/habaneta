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
        name: 'Mod. 130',
        imgUrl: '../assets/Border/Floral/l130.1.svg',
        cornerUrl: '../assets/Border/Floral/l130.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#D4F4A2',
          st2: '#E0DFDE',
          st3: '#913E3A',
          st4: '#EAE654',
          st5: '#8E9AF4',
          st6: '#819363',
          st7: '#ED7066',
          st8: '#F4B7B0',
          st9: '#707070',
          st10: '#56A5A5',
          st11: '#E8B356',
          st12: '#ACF460',
          st13: '#BFBFBF',
          st14: '#000000'
        }
      },
      {
        name: 'Mod. 126',
        imgUrl: '../assets/Border/Floral/l126.1.svg',
        cornerUrl: '../assets/Border/Floral/l126.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#000000'
        }
      },
      {
        name: 'Mod. 125',
        imgUrl: '../assets/Border/Floral/l125.1.svg',
        cornerUrl: '../assets/Border/Floral/l125.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#000000'
        }
      },
      {
        name: 'Mod. 87',
        imgUrl: '../assets/Border/Floral/l87.1.svg',
        cornerUrl: '../assets/Border/Floral/l87.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#EEEA69',
          st2: '#C4E1BC',
          st3: '#94CA66',
          st4: '#537B80',
          st5: '#313F76',
          st6: '#993D3D',
          st7: '#F6F19B'
        }
      },
      {
        name: 'Mod. 84',
        imgUrl: '../assets/Border/Floral/l84.1.svg',
        cornerUrl: '../assets/Border/Floral/l84.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#F4E7CF',
          st2: '#F0B961',
          st3: '#394C45',
          st4: '#3A6531',
          st5: '#E6E983',
          st6: '#64887A',
          st7: '#BCB961',
          st8: '#706F4F',
          st9: '#000000'
        }
      },
      {
        name: 'Mod. 84b',
        imgUrl: '../assets/Border/Floral/l84b.1.svg',
        cornerUrl: '../assets/Border/Floral/l84b.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#7F7F7F',
          st2: '#A1BAD3',
          st3: '#DAC7A9',
          st4: '#EEBA63',
          st5: '#DAE084',
          st6: '#7AA395',
          st7: '#EE4748',
          st8: '#689A4A',
          st9: '#000000'
        }
      },
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
          st5: '#000000'
        }
      },
      {
        name: 'Mod. 6',
        imgUrl: '../assets/Border/Floral/l6.1.svg',
        cornerUrl: '../assets/Border/Floral/l6.2.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#E9ED9A',
          st2: '#A4E6EA',
          st3: '#E0E2E2',
          st4: '#757575',
          st5: '#000000'
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
      },
      {
        name: 'Mod. 30',
        imgUrl: '../assets/Border/Floral/l30.1.svg',
        cornerUrl: '../assets/Border/Floral/l30.2.svg',
        cornerInteriorUrl: '../assets/Border/Floral/l30.3.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#EFC67D',
          st2: '#F9C2C2',
          st3: '#2AB2BC',
          st4: '#818281',
          st5: '#B4CC7F',
          st6: '#E2E2E2',
          st7: '#F9F9AA',
          st8: '#FFFFFF'
        }
      },
      {
        name: 'Mod. 31',
        imgUrl: '../assets/Border/Floral/l31.1.svg',
        cornerUrl: '../assets/Border/Floral/l31.2.svg',
        cornerInteriorUrl: '../assets/Border/Floral/l31.3.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#C9C9C9',
          st2: '#FCD465',
          st3: '#F9F567',
          st4: '#822121',
          st5: '#F7A9A9',
          st6: '#B6DEF2',
          st7: '#000000'
        }
      },
      {
        name: 'Mod. 86',
        imgUrl: '../assets/Border/Floral/l86.1.svg',
        cornerUrl: '../assets/Border/Floral/l86.2.svg',
        cornerInteriorUrl: '../assets/Border/Floral/l86.3.svg',
        type: Border,
        layers: {
          st0: '#FFFFFF',
          st1: '#F3CDA7',
          st2: '#9DD9E5',
          st3: '#1A1F1C',
          st4: '#C9E1A9',
          st5: '#96A78D',
          st6: '#667A94',
          st7: '#F6A3A4',
          st8: '#F3C43E',
          st9: '#F1ED7B',
          st10: '#A1BAD3',
          st11: '#635E4C'
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
      },
      {
        name: 'Mod. l02',
        imgUrl: '../assets/Tile/Contemporary/l02.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#72B2E1',
          st2: '#B4A45F',
          st3: '#C2DA73',
          st4: '#E8EB95'
        }
      },
      {
        name: 'Mod. l05',
        imgUrl: '../assets/Tile/Contemporary/l05.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#333333',
          st2: '#EEE993',
          st3: '#B69C77',
          st4: '#EA7067',
          st5: '#CCCCCC',
          st6: '#000000'
        }
      },
      {
        name: 'Mod. l20',
        imgUrl: '../assets/Tile/Contemporary/l20.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#F6E5C2',
          st2: '#C1C66C',
          st3: '#F1B763',
          st4: '#ECEC8B',
          st5: '#B98E5C',
          st6: '#475137',
          st7: '#29776F',
          st8: '#E9B68A',
          st9: '#231F20'
        }
      },
      {
        name: 'Mod. l21',
        imgUrl: '../assets/Tile/Contemporary/l21.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#A5A5A5',
          st2: '#000000'
        }
      },
      {
        name: 'Mod. l22',
        imgUrl: '../assets/Tile/Contemporary/l22.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#D6E0F2',
          st2: '#E7D8A8',
          st3: '#53C1B9'
        }
      },
      {
        name: 'Mod. l25',
        imgUrl: '../assets/Tile/Contemporary/l25.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#E7D8A8',
          st2: '#77A9B4',
          st3: '#616E77'
        }
      },
      {
        name: 'Mod. l26',
        imgUrl: '../assets/Tile/Contemporary/l26.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#F1DCA9',
          st2: '#BAE2E8',
          st3: '#77A9B4'
        }
      },
      {
        name: 'Mod. l27',
        imgUrl: '../assets/Tile/Contemporary/l27.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#EDCB82',
          st2: '#ECDFBB',
          st3: '#5B9DA4'
        }
      },
      {
        name: 'Mod. l28',
        imgUrl: '../assets/Tile/Contemporary/l28.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#F7F4B8',
          st2: '#C0E6EC',
          st3: '#77A9B4'
        }
      },
      {
        name: 'Mod. l33',
        imgUrl: '../assets/Tile/Contemporary/l33.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#F3E6BC',
          st2: '#99999A',
          st3: '#F8D993',
          st4: '#D5D4CC',
          st5: '#F0EE91',
          st6: '#8BD4E6',
          st7: '#000000'
        }
      },
      {
        name: 'Mod. l35',
        imgUrl: '../assets/Tile/Contemporary/l35.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#C9AC69',
          st2: '#B25538',
          st3: '#093542',
          st4: '#7894A2',
          st5: '#AFA68F'
        }
      },
      {
        name: 'Mod. l36',
        imgUrl: '../assets/Tile/Contemporary/l36.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#ECE973',
          st2: '#667A94',
          st3: '#EE7C73',
          st4: '#94CD8A',
          st5: '#DDDDDC',
          st6: '#C4E1BC',
          st7: '#717373',
          st8: '#93A2BA',
          st9: '#F7F3AA',
          st10: '#C9DADD'
        }
      },
      {
        name: 'Mod. l37',
        imgUrl: '../assets/Tile/Contemporary/l37.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#E5DB92",
          st2:"#ECBE6F",
          st3:"#A8CD6E",
          st4:"#72CEE8",
          st5:"#595A5A",
          st6:"#C4A06B",
          st7:"#C6C4C3",
          st8:"#ECE72B",
          st9:"#000000",
        }
      },
      {
        name: 'Mod. l38',
        imgUrl: '../assets/Tile/Contemporary/l38.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#CADADD",
          st2:"#6A81A5",
          st3:"#EDEB9D",
          st4:"#97A88E",
        }
      },
      {
        name: 'Mod. l39',
        imgUrl: '../assets/Tile/Contemporary/l39.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#C5E2BD",
          st2:"#F0BA7D",
          st3:"#F9D2D2",
          st4:"#F49F9F",
          st5:"#F4744D",
        }
      },
      {
        name: 'Mod. l41',
        imgUrl: '../assets/Tile/Contemporary/l41.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#CADADD",
          st2:"#94A3BB",
        }
      },
      {
        name: 'Mod. l43',
        imgUrl: '../assets/Tile/Contemporary/l43.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#7588BF",
          st2:"#D3D3D3",
          st3:"#494949",
          st4:"#7EAA53",
          st5:"#2EE6EF",
          st6:"#EAEA86",
          st7:"#F22C43",
          st8:"#9FA0A0",
          st9:"#000000",
        }
      },
      {
        name: 'Mod. l44',
        imgUrl: '../assets/Tile/Contemporary/l44.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#F3D29C",
          st2:"#5E6959",
          st3:"#EFB97D",
          st4:"#9EB2B5",
          st5:"#98985F",
          st6:"#C9DADD",
          st7:"#496791",
          st8:"#F4E7CF",
          st9:"#EDEB80",
          st10:"#ED6F80",
          st11:"#64887A",
          st12:"#D7E8B9",
          st13:"#F7C9D2",
        }
      },
      {
        name: 'Mod. l45',
        imgUrl: '../assets/Tile/Contemporary/l45.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#64887A",
          st2:"#667A94",
          st3:"#A3C09A",
          st4:"#C8D8BF",
          st5:"#F4E7CF",
          st6:"#99978D",
          st7:"#C9DADD",
        }
      },
      {
        name: 'Mod. l46',
        imgUrl: '../assets/Tile/Contemporary/l46.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#E5E563",
          st2:"#67ADA9",
          st3:"#E8C562",
          st4:"#F5E8D0",
          st5:"#C5E2BD",
          st6:"#667A95",
          st7:"#7EA679",
        }
      },
      {
        name: 'Mod. l47',
        imgUrl: '../assets/Tile/Contemporary/l47.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#E97878",
          st2:"#C5CB70",
          st3:"#6EBCCE",
          st4:"#F4E7CF",
          st5:"#A6BDAD",
          st6:"#98CC72",
          st7:"#E1DE4D",
          st8:"#E2BB3D",
          st9:"#B6B48E",
        }
      },
      {
        name: 'Mod. l48',
        imgUrl: '../assets/Tile/Contemporary/l48.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#7CAD5C",
          st2:"#BFBEBE",
          st3:"#5E6959",
        }
      },
      {
        name: 'Mod. l50',
        imgUrl: '../assets/Tile/Contemporary/l50.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#F4E7CF",
          st2:"#CCC7AD",
          st3:"#5C80AA",
        }
      },
      {
        name: 'Mod. l58',
        imgUrl: '../assets/Tile/Contemporary/l58.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#6A80A4",
          st2:"#F4E7CF",
          st3:"#7EA579",
          st4:"#C9DADD",
        }
      },
      {
        name: 'Mod. l59',
        imgUrl: '../assets/Tile/Contemporary/l59.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#7E82AD",
          st2:"#F4DBB3",
          st3:"#A7BEAE",
          st4:"#64897A",
          st5:"#F7E99A",
        }
      },
      {
        name: 'Mod. l64',
        imgUrl: '../assets/Tile/Contemporary/l64.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#E2E673",
          st2:"#7DCED9",
          st3:"#7EA579",
          st4:"#E47373",
        }
      },
      {
        name: 'Mod. l67',
        imgUrl: '../assets/Tile/Contemporary/l67.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#919191",
          st2:"#667A94",
          st3:"#F4E7CF",
          st4:"#A5BFC8",
          st5:"#7AA395",
        }
      },
      {
        name: 'Mod. l69',
        imgUrl: '../assets/Tile/Contemporary/l69.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#231F20",
        }
      },
      {
        name: 'Mod. l72',
        imgUrl: '../assets/Tile/Contemporary/l72.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#EFB97D",
          st2:"#F4E7CF",
          st3:"#A1BAD3",
        }
      },
      {
        name: 'Mod. l73',
        imgUrl: '../assets/Tile/Contemporary/l73.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#4B5C66",
          st2:"#C1E3F4",
          st3:"#ADADAD",
          st4:"#DBC9A1",
          st5:"#87AAC1",
          st6:"#847A61",
          st7:"#494949",
          st8:"#E5E57C",
        }
      },
      {
        name: 'Mod. l75',
        imgUrl: '../assets/Tile/Contemporary/l75.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#000000",
        }
      },
      {
        name: 'Mod. l80',
        imgUrl: '../assets/Tile/Contemporary/l80.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#F8C453",
          st2:"#A08D65",
          st3:"#F38081",
          st4:"#EFED8D",
          st5:"#598A9A",
          st6:"#4E886A",
          st7:"#264048",
          st8:"#8BD1F0",
          st9:"#F6EB0F",
          st10:"#2F513D",
          st11:"#96D1AD",
          st12:"#B1B28A",
        }
      },
      {
        name: 'Mod. l82',
        imgUrl: '../assets/Tile/Contemporary/l82.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#C2DFA9",
          st2:"#3B5636",
          st3:"#83BC7A",
        }
      },
      {
        name: 'Mod. l82b',
        imgUrl: '../assets/Tile/Contemporary/l82b.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#64887A",
          st2:"#3A6531",
          st3:"#F4E7CF",
          st4:"#E6E983",
          st5:"#394C45",
        }
      },
      {
        name: 'Mod. l84',
        imgUrl: '../assets/Tile/Contemporary/l84.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#EEBA63",
          st2:"#DAE084",
          st3:"#7F7F7F",
          st4:"#A1BAD3",
          st5:"#DAC7A9",
          st6:"#7AA395",
          st7:"#000000",
        }
      },
      {
        name: 'Mod. l85',
        imgUrl: '../assets/Tile/Contemporary/l85.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#F2F3BB",
          st2:"#EC7677",
          st3:"#667A94",
          st4:"#A5BFC8",
          st5:"#C4E1BC",
          st6:"#F5EF85",
        }
      },
      {
        name: 'Mod. l86',
        imgUrl: '../assets/Tile/Contemporary/l86.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#F3CDA7",
          st2:"#F3C43E",
          st3:"#1A1F1C",
          st4:"#98985F",
          st5:"#9DD9E5",
          st6:"#C9E1A9",
          st7:"#96A78D",
          st8:"#F1ED7B",
          st9:"#635E4C",
          st10:"#A1BAD3",
          st11:"#48AA63",
          st12:"#EF5253",
          st13:"#667A94",
          st14:"#F6A3A4",
        }
      },
      {
        name: 'Mod. l87',
        imgUrl: '../assets/Tile/Contemporary/l87.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#8D702B",
          st2:"#E2BB3D",
          st3:"#56C7EA",
          st4:"#993D3D",
          st5:"#537B80",
          st6:"#313F76",
          st7:"#94CA66",
          st8:"#EEEA69",
          st9:"#C4E1BC",
        }
      },
      {
        name: 'Mod. l88',
        imgUrl: '../assets/Tile/Contemporary/l88.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#77C593",
          st2:"#4D5C53",
          st3:"#E6E9A5",
        }
      },
      {
        name: 'Mod. l89',
        imgUrl: '../assets/Tile/Contemporary/l89.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#E8EB8E",
          st2:"#84AFCB",
          st3:"#E2E2E2",
        }
      },
      {
        name: 'Mod. l90',
        imgUrl: '../assets/Tile/Contemporary/l90.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#B9D885",
          st2:"#81C891",
          st3:"#ACA863",
          st4:"#F8E605",
          st5:"#EBEA7B",
          st6:"#66933F",
          st7:"#DDDDDC",
        }
      },
      {
        name: 'Mod. l91',
        imgUrl: '../assets/Tile/Contemporary/l91.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#428B7F",
          st2:"#54797B",
          st3:"#69C5B5",
          st4:"#BEE5ED",
        }
      },
      {
        name: 'Mod. l92',
        imgUrl: '../assets/Tile/Contemporary/l92.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#A4BC75",
          st2:"#233030",
          st3:"#EDE84C",
          st4:"#AFAFAE",
          st5:"#4A6F8E",
          st6:"#D6ED9D",
          st7:"#94D6CD",
        }
      },
      {
        name: 'Mod. l93',
        imgUrl: '../assets/Tile/Contemporary/l93.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#203A3A",
          st2:"#708648",
          st3:"#75C9D2",
          st4:"#427475",
        }
      },
      {
        name: 'Mod. l94',
        imgUrl: '../assets/Tile/Contemporary/l94.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#D72E2C",
          st2:"#F59C9E",
        }
      },
      {
        name: 'Mod. l95',
        imgUrl: '../assets/Tile/Contemporary/l95.svg',
        type: Floor,
        layers: {
          st0:"#FFFFFF",
          st1:"#666667",
          st2:"#97D7E1",
          st3:"#CCCBCB",
          st4:"#EEE78D",
        }
      },
      {
        name: 'Mod. l19',
        imgUrl: '../assets/Tile/Contemporary/l19.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#9FAA9F',
          st2: '#A3BFD9',
          st3: '#BADFC1',
          st4: '#EAD48D',
          st5: '#BA834C',
          st6: '#CBB582',
          st7: '#FDE261',
          st8: '#E5E5E4'
        }
      },
      {
        name: 'Mod. l18',
        imgUrl: '../assets/Tile/Contemporary/l18.svg',
        type: Floor,
        layers: {
          st0: '#FFFFFF',
          st1: '#A1D3A3',
          st2: '#DADADA',
          st3: '#F1E065',
          st4: '#E0DB8B',
          st5: '#838383',
          st6: '#000000'
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
