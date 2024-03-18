"use client";

import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

export type Event = {
  type       : "CHAT_CREATE_MESSAGE" | "CHAT_DELETE_MESSAGE" | "CHAT_TYPING"     , 
  statuscode :number    ,        
  payload    :any       ,
};

export type WSState = {
  conn: WebSocket | null;
  events: Event[];
}

const initialState: WSState = {
  conn: null,
  events: [],
};

type Action = 
  | {
      type: 'SET_WS';
      payload: WebSocket;
    }
  | {
      type: 'ADD_EVENT';
      payload: Event;
    }
  | {
      type: 'RESET';
    }

type WSCtx = WSState & {
  setConn: (data: WebSocket) => void;
  addEvent: (data: Event) => void;
  resetConn: () => void;
}

export const WSContext = createContext<WSCtx>({
  ...initialState,
  setConn: () => {},
  addEvent: () => {},
  resetConn: () => {},
});

function wsReducer(state: WSState, action: Action) {
  switch (action.type) {
    case 'SET_WS':
      return {
        ...state,
        conn: action.payload,
      };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload],
      };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unhandled action type`);
  }
}

export function WSProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(wsReducer, initialState);

  const setConn = (data: WebSocket) => {
    console.log("set conn", data);
    dispatch({ type: 'SET_WS', payload: data});
  };
  const addEvent = (data: Event) => dispatch({ type: 'ADD_EVENT', payload: data});
  const resetConn = () => dispatch({ type: 'RESET' });

  const value = useMemo<WSCtx>(() => ({
    ...state,
    setConn,
    addEvent,
    resetConn,
  }), [state]);

  return <WSContext.Provider value={value} {...props} />;
}

export const useWSCtx = () => {
  const context = useContext(WSContext);
  if (context === undefined) {
    throw new Error(`useWSCtx must be used within a PropertyDataProvider`);
  }
  return context;
};
