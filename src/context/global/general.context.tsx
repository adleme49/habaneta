import { createContext } from 'react';
import { IGeneralState, IGlobalDispatchers } from './general.models';

const GeneralContext = createContext<Partial<IGeneralState>>({});

export default GeneralContext;
