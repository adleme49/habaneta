import { createContext } from 'react';
import { IGeneralState, IGlobalDispatchers, initialDomivalues } from './general.models';

const GeneralContext = createContext<
  Partial<IGeneralState & IGlobalDispatchers>
>(initialDomivalues);

export default GeneralContext;
