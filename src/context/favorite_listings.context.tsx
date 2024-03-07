"use client";

import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

type State = {
  // list of favorite listings ids
  favListings: string[];
}

const initialState: State = {
  favListings: [],
};

type Action = 
  | {
      type: 'ADD_FAV_LISTING';
      payload: string;
    }
  | {
      type: 'REMOVE_FAV_LISTING';
      payload: string;
    }

export const FavListingsContext = createContext<State | any>(initialState);

function favListingsReducer(state: State, action: Action) {
  switch (action.type) {
    case 'ADD_FAV_LISTING':
      return {
        favListings: [
          ...state.favListings,
          action.payload,
        ]
      };
    case 'REMOVE_FAV_LISTING':
      return {
        favListings: [
          ...state.favListings,
          action.payload,
        ]
      };
    default:
      throw new Error(`Unhandled action type`);
  }
}

export function FavListingsProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(favListingsReducer, initialState);

  const addFavListing = (listingId: string) => dispatch({ type: 'ADD_FAV_LISTING',  payload: listingId});
  const removeFavListing = (listingId: string) => dispatch({ type: 'REMOVE_FAV_LISTING',  payload: listingId});

  const value = useMemo(() => ({
    ...state,
    addFavListing,
    removeFavListing,
  }), [state]);

  return <FavListingsContext.Provider value={value} {...props} />;
}

export const useFavListings = () => {
  const context = useContext(FavListingsContext);
  if (context === undefined) {
    throw new Error(`useFavListings must be used within a FavListingsProvider`);
  }
  return context;
};
