import { createContext } from 'react';
import { IGeneralState } from '../interfaces';

const GeneralContext = createContext<IGeneralState | any>({});

export default GeneralContext;
