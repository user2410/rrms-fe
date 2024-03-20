"use client";

import { Reminder } from "@/models/reminder";
import { createContext, PropsWithChildren, useContext, useMemo, useReducer } from "react";

export type ReminderState = {
  reminders: Reminder[]
}

const initialState: ReminderState = {
  reminders: []
};

type UpdateReminderStatus = {
  id: number;
  status: Reminder['status'];
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
    type: 'REMINDER_UPDATE_STATUS';
    payload: UpdateReminderStatus;
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
  updateReminderStatus: (data: UpdateReminderStatus) => void;
  resetReminders: () => void;
};

export const ReminderContext = createContext<ReminderCtx>({
  ...initialState,
  setReminders: () => { },
  addReminder: () => { },
  updateReminders: () => { },
  updateReminderStatus: () => { },
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
    case 'REMINDER_UPDATE_STATUS':
      for(let i=0; i<state.reminders.length; i++) {
        if(state.reminders[i].id === action.payload.id) {
          const newReminder = {
            ...state.reminders[i],
            status: action.payload.status,
          };
          console.log("update reminder status", [
            ...state.reminders.slice(0, i),
            newReminder,
            ...state.reminders.slice(i+1),
          ]);
          return {
            ...state,
            reminders: [
              ...state.reminders.slice(0, i),
              newReminder,
              ...state.reminders.slice(i+1),
            ],
          };
        }
      }
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
  const updateReminderStatus = (data: UpdateReminderStatus) => {
    dispatch({ type: 'REMINDER_UPDATE_STATUS', payload: data });
  };
  const resetReminders = () => {
    dispatch({ type: 'RESET' });
  };

  const value = useMemo(() => ({
    ...state,
    setReminders,
    addReminder,
    updateReminder,
    updateReminderStatus,
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
