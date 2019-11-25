import { createContext } from "react";
import { IRecentState, IRecentDispatchers } from "./recent.models";

const RecentContext = createContext<(IRecentState & IRecentDispatchers) | any>(
  {}
);

export default RecentContext;
