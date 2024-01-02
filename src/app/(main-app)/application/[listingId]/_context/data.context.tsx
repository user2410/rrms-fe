import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

type State = {
  listing?: Listing;
  property?: Property;
  units: Unit[];
};

const initialState : State = {
  units: [],
};

type Action =
  | {
      type: 'SET_LISTING',
      payload: Listing,
    }
  | {
      type: 'SET_PROPERTY',
      payload: Property,
    }
  | {
      type: 'SET_UNITS',
      payload: Unit[],
    };

export const DataCtx = createContext<State | any>(initialState);

function dataReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_LISTING':
      return {
        ...state,
        listing: action.payload,
      };
    case 'SET_PROPERTY':
      return {
        ...state,
        property: action.payload,
      };
    case 'SET_UNITS':
      return {
        ...state,
        units: action.payload,
      };
  }
}

export function DataProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const setListing = (listing: Listing) => dispatch({ type: 'SET_LISTING', payload: listing });
  const setProperty = (property: Property) => dispatch({ type: 'SET_PROPERTY', payload: property });
  const setUnits = (units: Unit[]) => dispatch({ type: 'SET_UNITS', payload: units });

  const value = useMemo(() => ({
    ...state,
    setListing,
    setProperty,
    setUnits,
  }), [state]);

  return <DataCtx.Provider value={value} />;
}

export const useData = () => {
  const context = useContext(DataCtx);
  if (context === undefined) {
    throw new Error(`useData must be used within a DataProvider`);
  }
  return context;
};

export function DataContext ({ children }: PropsWithChildren<{}>) {
  return (
    <DataProvider>
      {children}
    </DataProvider>
  );
};
