import { ScrollArea } from "@/components/ui/scroll-area";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Reminder } from "@/models/reminder";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useReminderCtx } from "../../_context/reminders.context";
import CreateReminderDialog from "./create_reminder";
import ReminderCard from "./reminder_card";
import { useEffect, useRef } from "react";
import { useWSCtx } from "../../_context/ws.context";

export default function ReminderList({
  applicationData,
  sessionData,
}: {
  applicationData: ManagedApplication;
  sessionData: Session;
}) {
  const {reminders, setReminders} = useReminderCtx();
  const createBtnRef = useRef<HTMLButtonElement>(null);
  
  const { application } = applicationData;

  const query = useQuery<Reminder[]>({
    queryKey: ["manage", "applications", "application", application.id, "reminders"],
    queryFn: async ({ queryKey }) => {
      const rs = (await backendAPI.get(`/api/applications/application/${queryKey.at(3)}/reminders`, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data || [];
      setReminders(rs);
      return rs;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  // const reminders = useMemo<Reminder[]>(() => {
  //   return filterEvents<Reminder>([
  //     ...oldReminders,
  //     ...events.filter(e => e.type === "REMINDER_CREATE").map(e => (e.payload as Reminder)),
  //   ],
  //     "id",
  //     (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).
  //     sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  // }, [oldReminders, events]);

  useEffect(() => {
    if (!createBtnRef.current) return;
    if (query.status === "success" && !reminders.find(r => r.status === "PENDING")) {
      console.log("enable create button");
      createBtnRef.current.disabled = false;
    } else {
      console.log("disable create button");
      createBtnRef.current.disabled = true;
    }
  }, [query.status, reminders]);

  return (
    <div className="col-span-2 flex flex-col gap-2">
      <ScrollArea className="bg-card h-[50vh]">
        {reminders.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl font-thin">Không có lịch hẹn nào</p>
          </div>
        )}
        {reminders.map((event) => (
          <ReminderCard
            key={event.id}
            reminder={event}
            applicationData={applicationData}
            sessionData={sessionData}
          />
        ))}
      </ScrollArea>
      <CreateReminderDialog
        ref={createBtnRef}
        applicationData={applicationData}
        sessionData={sessionData}
      />
    </div>
  );
};
