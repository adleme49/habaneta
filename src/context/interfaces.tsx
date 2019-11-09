export interface IGeneralState {
  loading: boolean;
  showModal: boolean;
  error: null | any;
  tilesCategory: ITileFamily[];
  borderCategory: IBorderFamily[];
  selectedCategory: null | ITileFamily | IBorderFamily;
  selectedType: null | IFloor | IBorder;
  recentsUsed: Array<IFloor | IBorder>;
  preview: boolean;
  selectedColor: string;
}

export interface ITileFamily {
  name: string;
  types: IFloor[];
}
export interface IBorderFamily {
  name: string;
  types: IBorder[];
}

export interface ITile {
  name: string;
}
export interface IFloor extends ITile {
  rotation?: boolean;
}

export interface IBorder extends ITile {
  corner?: boolean;
}

export interface IAction {
  type: string;
  payload?: any;
}

const tilesCat: ITileFamily[] = [
  {
    name: 'Traditional',
    types: [
      { name: 'Traditional 1' },
      { name: 'Traditional 2' },
      { name: 'Traditional 4' }
    ]
  }
];
const bordersCat: IBorderFamily[] = [
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

export const initialDomivalues: IGeneralState = {
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
