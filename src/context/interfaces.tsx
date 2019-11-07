export interface iGeneralState {
  loading: boolean;
  showModal: boolean;
  error: null | any;
  tilesCategory: tileCategory[];
  borderCategory: borderCategory[];
  selectedCategory: null | tileCategory | borderCategory;
  selectedType: null | Tile | Border;
  recentsUsed: Array<Tile | Border>;
  preview: boolean;
  selectedColor: string;
}

export interface tileCategory {
  name: string;
  types: Tile[];
}
export interface borderCategory {
  name: string;
  types: Border[];
}

export interface Tile {
  name: string;
}

export interface Border {
  name: string;
}
export interface iAction {
  type: string;
  payload?: any;
}

const tilesCat: tileCategory[] = [
  {
    name: 'Traditional',
    types: [
      { name: 'Traditional 1' },
      { name: 'Traditional 2' },
      { name: 'Traditional 4' }
    ]
  }
];
const bordersCat: borderCategory[] = [
  {
    name: 'TraditionalB',
    types: [
      { name: 'TraditionalB 1' },
      { name: 'TraditionalB 2' },
      { name: 'TraditionalB 3' },
      { name: 'TraditionalB 4' }
    ]
  },
  {
    name: 'TraditionalB1',
    types: [{ name: 'TraditionalB 1' }, { name: 'TraditionalB 2' }]
  }
];

export const initialDomivalues: iGeneralState = {
  loading: false,
  showModal: false,
  tilesCategory: tilesCat,
  borderCategory: bordersCat,
  selectedCategory: null,
  recentsUsed: [
    { name: 'empty' },
    { name: 'empty' },
    { name: 'empty' },
    { name: 'empty' },
    { name: 'empty' }
  ],
  error: null,
  selectedType: null,
  preview: false,
  selectedColor: 'grey'
};
