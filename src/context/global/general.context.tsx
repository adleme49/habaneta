import { createContext } from 'react';
import { IGeneralState, IGlobalDispatchers } from './general.models';

const GeneralContext = createContext<
  Partial<IGeneralState & IGlobalDispatchers>
>({});

export default GeneralContext;
