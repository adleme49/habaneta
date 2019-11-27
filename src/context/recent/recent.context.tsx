import { createContext } from 'react';
import { IRecentState, IRecentDispatchers, initialStateRecent } from './recent.models';

const RecentContext = createContext<Partial<IRecentState & IRecentDispatchers>>(
  initialStateRecent
);

export default RecentContext;
