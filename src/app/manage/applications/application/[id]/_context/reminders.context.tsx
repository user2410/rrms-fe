"use client";

import { Reminder } from "@/models/reminder";
import { createContext, PropsWithChildren, useContext, useMemo, useReducer } from "react";

export type ReminderState = {
  reminders: Reminder[]
}

const initialState: ReminderState = {
  reminders: []
};

type Action = 
  | {
    type: 'SET_REMINDERS';
    payload: Reminder[];
  }
  | {
    type: 'ADD_REMINDER';
    payload: Reminder;
  }
  | {
    type: 'UPDATE_REMINDERS';
    payload: Reminder[];
  }
  | {
    type: 'DELETE_REMINDER';
    payload: Reminder["id"]; // reminder id type
  }
  | {
    type: 'RESET';
  };

type ReminderCtx = ReminderState & {
  setReminders: (data: Reminder[]) => void;
  addReminder: (data: Reminder) => void;
  updateReminders: (data: Reminder[]) => void;
  resetReminders: () => void;
};

export const ReminderContext = createContext<ReminderCtx>({
  ...initialState,
  setReminders: () => { },
  addReminder: () => { },
  updateReminders: () => { },
  resetReminders: () => { },
});

function reminderReducer(state: ReminderState, action: Action) {
  switch (action.type) {
    case 'SET_REMINDERS':
      return {
        ...state,
        reminders: action.payload.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      };
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: [...state.reminders, action.payload].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      };
    case 'UPDATE_REMINDERS':
      return {
        ...state,
        reminders: action.payload,
      };
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(m => m.id !== action.payload),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function RemindersProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(reminderReducer, initialState);

  const setReminders = (data: Reminder[]) => {
    dispatch({ type: 'SET_REMINDERS', payload: data });
  };
  const addReminder = (data: Reminder) => {
    dispatch({ type: 'ADD_REMINDER', payload: data });
  };
  const updateReminder = (data: Reminder[]) => {
    dispatch({ type: 'UPDATE_REMINDERS', payload: data });
  };
  const resetReminders = () => {
    dispatch({ type: 'RESET' });
  };

  const value = useMemo(() => ({
    ...state,
    setReminders,
    addReminder,
    updateReminder,
    resetReminders,
  }), [state]);

  return <ReminderContext.Provider value={value} {...props} />; 
}

export function useReminderCtx() {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error("useReminderCtx must be used within a RemindersProvider");
  }
  return context;
}
