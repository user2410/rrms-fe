"use client";

import { Message } from "@/models/message";
import { createContext, PropsWithChildren, useContext, useMemo, useReducer } from "react";

export type MessageState = {
  messages: Message[]
}

const initialState: MessageState = {
  messages: []
};

type Action = 
  | {
    type: 'SET_MESSAGES';
    payload: Message[];
  }
  | {
    type: 'ADD_MESSAGE';
    payload: Message;
  }
  | {
    type: 'UPDATE_MESSAGE';
    payload: Message;
  }
  | {
    type: 'DELETE_MESSAGE';
    payload: number; // message id type
  }
  | {
    type: 'RESET';
  };

type MessageCtx = MessageState & {
  setMessages: (data: Message[]) => void;
  addMessage: (data: Message) => void;
  updateMessage: (data: Message) => void;
  deleteMessage: (data: number) => void;
  resetMessages: () => void;
};

export const MessageContext = createContext<MessageCtx>({
  ...initialState,
  setMessages: () => { },
  addMessage: () => { },
  updateMessage: () => { },
  deleteMessage: () => { },
  resetMessages: () => { },
});

function messageReducer(state: MessageState, action: Action) {
  switch (action.type) {
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m => m.id === action.payload.id ? action.payload : m),
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(m => m.id !== action.payload),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function MessagesProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(messageReducer, initialState);

  const setMessages = (data: Message[]) => {
    dispatch({ type: 'SET_MESSAGES', payload: data });
  };
  const addMessage = (data: Message) => {
    dispatch({ type: 'ADD_MESSAGE', payload: data });
  };
  const updateMessage = (data: Message) => {
    dispatch({ type: 'UPDATE_MESSAGE', payload: data });
  };
  const deleteMessage = (data: number) => {
    dispatch({ type: 'DELETE_MESSAGE', payload: data });
  };
  const resetMessages = () => {
    dispatch({ type: 'RESET' });
  };

  const value = useMemo(() => ({
    ...state,
    setMessages,
    addMessage,
    updateMessage,
    deleteMessage,
    resetMessages,
  }), [state]);

  return <MessageContext.Provider value={value} {...props} />; 
}

export function useMessageCtx() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageCtx must be used within a MessagesProvider");
  }
  return context;
}
