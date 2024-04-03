import { Application } from "@/models/application";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { User } from "@/models/user";
import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

export type RentalData = {
  rental: Partial<Rental> | null;
  application?: Application;
  property: Property;
  unit: Unit;
  managers: User[];
  owners: User[];
  tenant?: User;
};

const initialState : RentalData = {
  rental: null,
  property: {} as Property,
  unit: {} as Unit,
  managers: [],
  owners: [],
  tenant: {} as User,
};

type Action =
  | {
      type: 'SET_DATA',
      payload: RentalData,
    }
  | {
      type: 'SET_RENTAL',
      payload: Partial<Rental>,
    }
  | {
      type: 'SET_APPLICATION',
      payload: Application,
    }
  | {
      type: 'SET_PROPERTY',
      payload: Property,
    }
  | {
      type: 'SET_UNIT',
      payload: Unit,
    }
  | {
      type: 'SET_MANAGERS',
      payload: User[],
    }
  | {
      type: 'SET_OWNERS',
      payload: User[],
    };

type DataCtx = RentalData & {
  setRentalData: (data: RentalData) => void;
  setRental: (data: Partial<Rental>) => void;
  setApplication: (data: Application) => void;
  setProperty: (data: Property) => void;
  setUnit: (data: Unit) => void;
};

export const DataContext = createContext<DataCtx>({
  ...initialState,
  setRentalData: () => {},
  setRental: () => {},
  setApplication: () => {},
  setProperty: () => {},
  setUnit: () => {},
});

function dataReducer(state: RentalData, action: Action) {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        ...action.payload,
      };
    case 'SET_RENTAL':
      return {
        ...state,
        rental: action.payload,
      };
    case 'SET_APPLICATION':
      return {
        ...state,
        application: action.payload,
      };
    case 'SET_PROPERTY':
      return {
        ...state,
        property: action.payload,
      };
    case 'SET_UNIT':
      return {
        ...state,
        unit: action.payload,
      };
    case 'SET_MANAGERS':
      return {
        ...state,
        managers: action.payload,
      };
    case 'SET_OWNERS':
      return {
        ...state,
        owners: action.payload,
      };
    default:
      return state;
  }
}

export function DataProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const setRentalData = (rental: RentalData) => dispatch({ type: 'SET_DATA', payload: rental });
  const setRental = (rental: Partial<Rental>) => dispatch({ type: 'SET_RENTAL', payload: rental });
  const setApplication = (application: Application) => dispatch({ type: 'SET_APPLICATION', payload: application });
  const setProperty = (property: Property) => dispatch({ type: 'SET_PROPERTY', payload: property });
  const setUnit = (unit: Unit) => dispatch({ type: 'SET_UNIT', payload: unit });
  const setManagers = (managers: User[]) => dispatch({ type: 'SET_MANAGERS', payload: managers });
  const setOwners = (owners: User[]) => dispatch({ type: 'SET_OWNERS', payload: owners });

  const value = useMemo<DataCtx>(() => ({
    ...state,
    setRentalData,
    setRental,
    setApplication,
    setProperty,
    setUnit,
    setManagers,
    setOwners,
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
