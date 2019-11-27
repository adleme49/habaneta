import { createContext } from 'react';
import {
  IGeneralState,
  IGlobalDispatchers,
  initialDomivalues,
  initialGlobalDispatchers
} from './general.models';

const GeneralContext = createContext<IGeneralState & IGlobalDispatchers>({
  ...initialDomivalues,
  ...initialGlobalDispatchers
});

export default GeneralContext;
