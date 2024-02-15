"use client";

import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";

type AuthSchema = {
  accessToken: string;
  accessExp: string;
  refreshToken: string;
  refreshExp: string;
  user: {
    id: string;
    email: string;
    created_at: string;
    created_by: string;
    updated_at: string;
    deleted_f: boolean;
  }
};

interface State {
  auth: AuthSchema | null;
}

const initialState: State = {
  auth: null,
};

type Action = 
  | {
      type: 'ENROLL_AUTH',
      payload: AuthSchema,
    }
  | {
      type: 'CLEAR_AUTH'
  }

export const ManageContext = createContext<State | any>(initialState);

function uiReducer(state: State, action: Action) {
  switch (action.type) {
    case 'ENROLL_AUTH':
      return {
        ...state,
        auth: action.payload, 
      };
    case 'CLEAR_AUTH':
      return {
        ...state,
        auth: null,
      };
  }
}

export function ManageProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const enrollAuth = (payload: AuthSchema) => dispatch({ type: 'ENROLL_AUTH', payload });
  const clearAuth = () => dispatch({ type: 'CLEAR_AUTH' });

  const value = useMemo(() => ({
    ...state,
    enrollAuth,
    clearAuth,
  }), [state]);

  return <ManageContext.Provider value={value} {...props} />;
}

export const useManage = () => {
  const context = useContext(ManageContext);
  if (context === undefined) {
    throw new Error(`useManage must be used within a UIProvider`);
  }
  return context;
};
