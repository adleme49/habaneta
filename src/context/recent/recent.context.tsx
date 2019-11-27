import { createContext } from 'react';
import {
  IRecentState,
  IRecentDispatchers,
  initialStateRecent,
  initialDispachersRecent
} from './recent.models';

const RecentContext = createContext<IRecentState & IRecentDispatchers>({
  ...initialStateRecent,
  ...initialDispachersRecent
});

export default RecentContext;
