import { createContext } from 'react';
import { IRecentState, IRecentDispatchers } from './recent.models';

const RecentContext = createContext<Partial<IRecentState & IRecentDispatchers>>(
  {}
);

export default RecentContext;
