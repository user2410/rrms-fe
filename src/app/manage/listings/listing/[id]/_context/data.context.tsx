import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { Session } from "next-auth";
import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

export type ListingData = {
  listing: Listing;
  property: Property;
  units: Unit[];
};

type State = ListingData & {
  sessionData: Session;
};

const initialState : State = {
  sessionData: {} as Session,
  listing: {} as Listing,
  property: {} as Property,
  units: [],
};

type Action =
  | {
      type: 'SET_SESSIONDATA',
      payload: Session,
  }
  | {
      type: 'SET_DATA',
      payload: ListingData,
    }
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

type DataCtx = State & {
  setSessionData: (data: Session) => void;
  setListingData: (data: ListingData) => void;
  setListing: (data: Listing) => void;
  setProperty: (data: Property) => void;
  setUnits: (data: Unit[]) => void;
  isSet: () => boolean;
};

export const DataContext = createContext<DataCtx>({
  ...initialState,
  setSessionData: () => {},
  setListingData: () => {},
  setListing: () => {},
  setProperty: () => {},
  setUnits: () => {},
  isSet: () => false,
});

function dataReducer(state: State, action: Action) {
  switch (action.type) {
    case 'SET_SESSIONDATA':
      return {
        ...state,
        sessionData: action.payload,
      };
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_LISTING':
      return {
        ...state,
        rental: action.payload,
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
    default:
      return state;
  }
}

export function DataProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const setSessionData = (session: Session) => dispatch({ type: 'SET_SESSIONDATA', payload: session });
  const setListingData = (data: ListingData) => dispatch({ type: 'SET_DATA', payload: data });
  const setListing = (listing: Listing) => dispatch({ type: 'SET_LISTING', payload: listing });
  const setProperty = (property: Property) => dispatch({ type: 'SET_PROPERTY', payload: property });
  const setUnits = (units: Unit[]) => dispatch({ type: 'SET_UNITS', payload: units });
  const isSet = () => (
    state.listing.id !== undefined
    && state.property.id !== undefined
    && state.units.length > 0
    && state.sessionData.user !== undefined
  );

  const value = useMemo<DataCtx>(() => ({
    ...state,
    setSessionData,
    setListingData,
    setListing,
    setProperty,
    setUnits,
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
