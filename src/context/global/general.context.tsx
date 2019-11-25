import { createContext } from 'react';
import { IGeneralState, IGlobalDispatchers } from './general.models';

const GeneralContext = createContext<
  (IGeneralState & IGlobalDispatchers) | any
>({});

export default GeneralContext;
