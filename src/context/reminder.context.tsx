"use client";

import { Reminder } from "@/models/reminder";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from "react";
import toast from "react-hot-toast";

type State = {
  reminders: Reminder[];
};

const initialState: State = {
  reminders: [] as Reminder[],
};

type Action =
  | {
    type: 'ADD_REMINDER',
    payload: Reminder,
  };

type ReminderCtx = State & {
  addReminder: (reminder: Reminder) => void;
};

export const ReminderContext = createContext<ReminderCtx>({
  ...initialState,
  addReminder: () => { },
});

function dataReducer(state: State, action: Action) {
  switch (action.type) {
    case 'ADD_REMINDER':
      return {
        ...state,
        reminders: state.reminders.some(reminder => reminder.id === action.payload.id) ? state.reminders : [...state.reminders, action.payload],
      };
    default:
      return state;
  }
}

const NOTIFICATIONLEADTIME = 15; // 15 minutes

function notifyReminder(r: Reminder) {
  toast.custom((t) => (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              Bạn có lịch hẹn từ {new Date(r.startAt).toLocaleTimeString("vi-VN")} đến {new Date(r.endAt).toLocaleTimeString("vi-VN")} tại {r.location}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {r.title}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          OK
        </button>
      </div>
    </div>
  ), {
    position: "top-right",
    duration: 1000 * 20, // 20 seconds
  });
}

export function ReminderProvider(props: PropsWithChildren<any>) {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const timeoutIdsRef = useRef<NodeJS.Timeout[]>([]);

  const setAlarm = useCallback((reminder: Reminder, leadTimeInMinutes: number) => {
    console.log(`Setting alarm for reminder: ${reminder.title}`);
    const now = new Date();
    const startTime = new Date(reminder.startAt);
    const leadTimeInMilliseconds = leadTimeInMinutes * 60 * 1000;
    const alarmTime = startTime.getTime() - leadTimeInMilliseconds;
    const timeDifference = alarmTime - now.getTime();

    if (alarmTime > now.getTime()) {
      console.log(`Reminder: ${reminder.title} starts in ${leadTimeInMinutes} minutes!`);
      const timeoutId = setTimeout(() => {
        console.log(`Reminder: ${reminder.title} starts in ${leadTimeInMinutes} minutes!`);
        notifyReminder(reminder);
      }, timeDifference);
      timeoutIdsRef.current.push(timeoutId);
    } else if (alarmTime <= now.getTime() && startTime.getTime() >= now.getTime()) {
      console.log(`Reminder: ${reminder.title} starts now!`);
      const timeoutId = setTimeout(() => {
        console.log(`Reminder: ${reminder.title} starts now!`);
        notifyReminder(reminder);
      }, 0);
      timeoutIdsRef.current.push(timeoutId);
    }
  }, []);

  const addReminder = useCallback((newReminder: Reminder) => {
    console.log(`Adding reminder: ${newReminder.title}`); 
    dispatch({ type: 'ADD_REMINDER', payload: newReminder });
    setAlarm(newReminder, NOTIFICATIONLEADTIME);
  }, [setAlarm]);
  // const addReminder = (newReminder: Reminder) => {
  //   console.log(`Adding reminder: ${newReminder.title}`); // BUG: not called
  //   dispatch({ type: 'ADD_REMINDER', payload: newReminder });
  //   setAlarm(newReminder, NOTIFICATIONLEADTIME);
  // };

  useEffect(() => {
    return () => {
      // Clear all timeouts when the component unmounts
      timeoutIdsRef.current.forEach(clearTimeout);
    };
  }, []);

  return <ReminderContext.Provider value={{state, addReminder}} {...props} />;
}

export const useReminderCtx = () => {
  const context = useContext(ReminderContext);
  if (context === undefined) {
    throw new Error(`useReminderCtx must be used within a ReminderProvider`);
  }
  return context;
};
