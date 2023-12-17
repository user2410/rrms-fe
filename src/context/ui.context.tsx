"use client";

import { PropsWithChildren, createContext, useContext, useMemo, useReducer } from "react";
import { ModalProvider } from "./modal.context";
import { ThemeProvider } from "./theme.context";

interface State {
  displaySidebar: boolean;
}

const initialState: State = {
  displaySidebar: false,
};

type Action = 
  | {
      type: 'OPEN_SIDEBAR'
    }
  | {
      type: 'CLOSE_SIDEBAR'
  }

export const UIContext = createContext<State | any>(initialState);

function uiReducer(state: State, action: Action) {
  switch (action.type) {
    case 'OPEN_SIDEBAR':
      return {
        ...state,
        displaySidebar: true, 
      };
    case 'CLOSE_SIDEBAR':
      return {
        ...state,
        displaySidebar: false,
      };
  }
}

export function UIProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  const openSidebar = () => dispatch({ type: 'OPEN_SIDEBAR' });
  const closeSidebar = () => dispatch({ type: 'CLOSE_SIDEBAR' });

  const value = useMemo(() => ({
    ...state,
    openSidebar,
    closeSidebar,
  }), [state]);

  return <UIContext.Provider value={value} {...props} />;
}

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error(`useUI must be used within a UIProvider`);
  }
  return context;
};

export function ManagedUIContext({ children }: PropsWithChildren<{}>) {
  return (
    <UIProvider>
      <ModalProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </ModalProvider>
    </UIProvider>
  );
}
