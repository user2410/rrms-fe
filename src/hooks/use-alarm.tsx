import { Reminder } from "@/models/reminder";
import { log } from "console";
import { useEffect } from "react";

export const useAlarms = (
  reminders: Reminder[], 
  notificationLeadTime: number,
  cb: (reminder: Reminder) => void,
) => {
  useEffect(() => {
    const timers : NodeJS.Timeout[] = [];
  
    reminders?.forEach((reminder) => {
      const now = new Date();
      const startTime = new Date(reminder.startAt);
      const leadTimeInMilliseconds = notificationLeadTime * 60 * 1000;
      const alarmTime = startTime.getTime() - leadTimeInMilliseconds;
      
      if (alarmTime > now.getTime()) {
        const timeDifference = alarmTime - now.getTime();
        const timer = setTimeout(() => {
          cb(reminder);
        }, timeDifference);
        timers.push(timer);
      } else if (alarmTime <= now.getTime() && startTime.getTime() >= now.getTime()) {
        const timer = setTimeout(() => {
          cb(reminder);
        }, 0);
        timers.push(timer);
      }
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [reminders, notificationLeadTime]);
};