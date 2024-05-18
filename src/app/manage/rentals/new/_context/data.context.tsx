import { Application } from "@/models/application";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { User } from "@/models/user";
import { Session } from "next-auth";
import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

type State = {
  sessionData: Session;
};

const initialState : State = {
  sessionData: {} as Session,
};

type Action =
  | {
      type: 'SET_SESSIONDATA',
      payload: Session,
  };

type DataCtx = State & {
  setSessionData: (data: Session) => void;
  isSet: () => boolean;
};

export const DataContext = createContext<DataCtx>({
  ...initialState,
  setSessionData: () => {},
  isSet: () => false,
});

function dataReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_SESSIONDATA':
      return {
        ...state,
        sessionData: action.payload,
      };
    default:
      return state;
  }
}

export function DataProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const setSessionData = (session: Session) => dispatch({ type: 'SET_SESSIONDATA', payload: session });
  const isSet = () => (state.sessionData.user !== undefined);

  const value = useMemo<DataCtx>(() => ({
    ...state,
    setSessionData,
    isSet,
  }), [state]);

  return <DataContext.Provider value={value} {...props} />;
}

export const useDataCtx = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error(`useData must be used within a DataProvider`);
  }
  return context;
};
