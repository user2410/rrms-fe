"use client";

import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { nullFieldsToUndefined } from "@/utils/query";
import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

export type PropDataState = {
  property: Property;
  units: Unit[];
}

const initialState: PropDataState = {
  property: {} as Property,
  units: [],
};

type Action = 
  | {
      type: 'SET_DATA';
      payload: PropDataState;
    }
  | {
      type: 'RESET';
    }

type PropDataCtx = PropDataState & {
  setPropData: (data: PropDataState) => void;
  resetPropData: () => void;
}

export const PropertyDataContext = createContext<PropDataCtx>({
  ...initialState,
  setPropData: () => {},
  resetPropData: () => {},
});

function propDataReducer(state: PropDataState, action: Action) {
  switch (action.type) {
    case 'SET_DATA':
      return {
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

  const setPropData = (data: PropDataState) => dispatch({ type: 'SET_DATA',  payload: data});
  const resetPropData = () => dispatch({ type: 'RESET' });

  const value = useMemo<PropDataCtx>(() => ({
    ...state,
    setPropData,
    resetPropData,
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
