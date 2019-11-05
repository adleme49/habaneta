export interface iGeneralState {
  loading: boolean;
  error: null | any;
  tilesCategory: tileCategory[];
  borderCategory: borderCategory[];
  selectedCategory: null | tileCategory | borderCategory;
}

export interface tileCategory {
  name: string;
  tilesTypes: Tile[];
}
export interface borderCategory {
  name: string;
  borderTypes: Border[];
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
    tilesTypes: [
      { name: 'Traditional 1' },
      { name: 'Traditional 2' },
      { name: 'Traditional 3' }
    ]
  }
];
const bordersCat: borderCategory[] = [
  {
    name: 'TraditionalB',
    borderTypes: [
      { name: 'TraditionalB 1' },
      { name: 'TraditionalB 2' },
      { name: 'TraditionalB 3' }
    ]
  }
];

export const initialDomivalues: iGeneralState = {
  loading: false,
  tilesCategory: tilesCat,
  borderCategory: bordersCat,
  selectedCategory: null,
  error: null
};
