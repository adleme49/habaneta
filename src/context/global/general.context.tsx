import { createContext } from 'react';
import { IGeneralState } from './general.models';

const GeneralContext = createContext<Partial<IGeneralState>>({});

export default GeneralContext;
