import { useReminderCtx } from '@/context/reminder.context';
import { backendAPI } from '@/libs/axios';
import { Reminder } from '@/models/reminder';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useRef } from 'react';

export const useAddReminder = () => {
  const { addReminder } = useReminderCtx();

  return useCallback((reminder: Reminder) => {
    addReminder(reminder);
  }, [addReminder]);
};

export const useFetchReminders = () => {
  const { addReminder } = useReminderCtx();
  const { data: session, status } = useSession();

  const {data: reminders} = useQuery<Reminder[]>({
    queryKey: ["reminders", session?.user.accessToken],
    queryFn: async ({queryKey}) => {
      const minStartAt = new Date();
      const maxStartAt = new Date();
      maxStartAt.setHours(23, 59, 59, 999);
      const res = (await backendAPI.get<Reminder[]>("/api/reminders", {
        params: {
          minStartAt,
          maxStartAt,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
        validateStatus: (status) => status < 500,
      })).data || ([] as Reminder[]);
      console.log(res);
      return res;
    },
    enabled: status === "authenticated" && !!session?.user.accessToken,
    refetchInterval: 1000 * 60 * 10, // every 10 minute
  });

  useEffect(() => {
    if (reminders) {
      console.log("about to add reminders", reminders);
      reminders.forEach((r) => {
        console.log("about to add reminder", r);
        addReminder(r);
      });
    }
  }, [reminders, addReminder]);
};
