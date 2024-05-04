import { ScrollArea } from "@/components/ui/scroll-area";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Reminder } from "@/models/reminder";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useReminderCtx } from "../../_context/reminders.context";
import CreateReminderDialog, { FormValues } from "./create_reminder";
import ReminderCard from "./reminder_card";
import { useEffect, useRef } from "react";
import { useWSCtx } from "../../_context/ws.context";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function ReminderList({
  applicationData,
  sessionData,
}: {
  applicationData: ManagedApplication;
  sessionData: Session;
}) {
  const {reminders, setReminders} = useReminderCtx();
  const { conn } = useWSCtx();

  const { application } = applicationData;

  useEffect(() => {
    (async () => {
      const rs = (await backendAPI.get(`/api/applications/application/${application.id}/reminders`, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data || [];
      setReminders(rs);
    }) ();
  }, []);

  async function handleCreateReminder(data: FormValues) {
    console.log("submit:", data);
    try {
      const res = (await backendAPI.post<Reminder>(`/api/applications/application/${applicationData.application.id}/reminders`, data, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data;
      conn?.send(JSON.stringify({
        type: "REMINDER_CREATE",
        payload: res,
      }));
      toast.success("Tạo lịch hẹn thành công");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi tạo lịch hẹn");
    }
  }

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
        triggerBtn={(<Button variant="outline" className="w-full font-light uppercase">Tạo lịch hẹn</Button>)}
        handleCreateReminder={handleCreateReminder}
      />
    </div>
  );
};
