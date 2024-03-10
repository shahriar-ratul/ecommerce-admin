import { createContext } from "react";
import { createContextualCan } from "@casl/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AbilityContext = createContext(null as any);

// eslint-disable-next-line 
export const Can = createContextualCan(AbilityContext.Consumer);
