import { createContext } from 'react';
import { IGeneralState } from './general.models';

const GeneralContext = createContext<IGeneralState | any>({});

export default GeneralContext;
