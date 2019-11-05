import { createContext } from 'react';
import { iGeneralState } from '../interfaces';

const GeneralContext = createContext<iGeneralState | any>({});

export default GeneralContext;
