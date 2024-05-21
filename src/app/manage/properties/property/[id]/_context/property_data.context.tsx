"use client";

import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { nullFieldsToUndefined } from "@/utils/query";
import { Session } from "next-auth";
import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

export type PropDataState = {
  property: Property;
  units: Unit[];
}

export type State = PropDataState & {
  sessionData: Session;
};

const initialState: State = {
  sessionData: {} as Session,
  property: {} as Property,
  units: [],
};

type Action = 
  | {
      type: 'SET_SESSIONDATA';
      payload: Session;
    }
  | {
      type: 'SET_DATA';
      payload: PropDataState;
    }
  | {
      type: 'RESET';
    }

type PropDataCtx = State & {
  setSessionData: (data: Session) => void;
  setPropData: (data: PropDataState) => void;
  resetPropData: () => void;
  isSet: () => boolean;
}

export const PropertyDataContext = createContext<PropDataCtx>({
  ...initialState,
  setSessionData: () => {},
  setPropData: () => {},
  resetPropData: () => {},
  isSet: () => false,
});

function propDataReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_SESSIONDATA':
      return {
        ...state,
        sessionData: action.payload,
      };
    case 'SET_DATA':
      return {
        ...state,
        property: nullFieldsToUndefined(action.payload.property),
        units: nullFieldsToUndefined(action.payload.units),
      };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unhandled action type`);
  }
}

export function PropertyDataProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(propDataReducer, initialState);

  const setSessionData = (session: Session) => dispatch({ type: 'SET_SESSIONDATA', payload: session });
  const setPropData = (data: PropDataState) => dispatch({ type: 'SET_DATA',  payload: data});
  const resetPropData = () => dispatch({ type: 'RESET' });
  const isSet = () => (
    state.property.id !== undefined 
    && state.units.length > 0
    && state.sessionData.user !== undefined
  );

  const value = useMemo<PropDataCtx>(() => ({
    ...state,
    setSessionData,
    setPropData,
    resetPropData,
    isSet,
  }), [state]);

  return <PropertyDataContext.Provider value={value} {...props} />;
}

export const usePropDataCtx = () => {
  const context = useContext(PropertyDataContext);
  if (context === undefined) {
    throw new Error(`usePropDataCtx must be used within a PropertyDataProvider`);
  }
  return context;
};
