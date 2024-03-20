"use client";

import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

export type Event = {
  type: "CHAT_CREATE_MESSAGE" | "CHAT_DELETE_MESSAGE" | "CHAT_TYPING" | "REMINDER_CREATE" | "REMINDER_UPDATE_STATUS",
  statuscode: number,
  payload: any,
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
    payload: WebSocket | null;
  }
  | {
    type: 'ADD_EVENT';
    payload: Event;
  }
  | {
    type: 'CHANGE_EVENT';
    payload: Event[];
  }
  | {
    type: 'RESET';
  }

type WSCtx = WSState & {
  setConn: (data: WebSocket | null) => void;
  addEvent: (data: Event) => void;
  changeEvent: (matchFn: (e: Event) => boolean, changeFn: (e: Event) => Event) => boolean;
  reset: () => void;
}

export const WSContext = createContext<WSCtx>({
  ...initialState,
  setConn: () => { },
  addEvent: () => { },
  changeEvent: () => false,
  reset: () => { },
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
    case 'CHANGE_EVENT':
      return {
        ...state,
        events: action.payload,
      };
    case 'RESET':
      return initialState;
    default:
      throw new Error(`Unhandled action type`);
  }
}

export function WSProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(wsReducer, initialState);

  const setConn = (data: WebSocket | null) => {
    console.log("set conn", data);
    dispatch({ type: 'SET_WS', payload: data });
  };
  const addEvent = (data: Event) => dispatch({ type: 'ADD_EVENT', payload: data });
  const changeEvent = (matchFn: (e: Event) => boolean, changeFn: (e: Event) => Event) => {
    var newEvents : Event[] = state.events;
    var changed = false;
    for(let i=0; i<state.events.length; i++) {
      if(matchFn(state.events[i])) {
        const newEvent = changeFn(state.events[i]);
        newEvents = [
          ...state.events.slice(0, i),
          newEvent,
          ...state.events.slice(i+1),
        ];
        changed = true;
      }
    }
    dispatch({ type: 'CHANGE_EVENT', payload: newEvents });
    return changed;
  };
  const resetConn = () => dispatch({ type: 'RESET' });

  const value = useMemo<WSCtx>(() => ({
    ...state,
    setConn,
    addEvent,
    changeEvent,
    reset: resetConn,
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
