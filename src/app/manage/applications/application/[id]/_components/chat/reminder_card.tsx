import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Reminder } from "@/models/reminder";
import clsx from "clsx";
import { MoreVertical } from "lucide-react";
import { Session } from "next-auth";
import toast from "react-hot-toast";
import { useWSCtx } from "../../_context/ws.context";

export default function ReminderCard({
  reminder,
  applicationData,
  sessionData,
} : {
  reminder: Reminder;
  applicationData: ManagedApplication;
  sessionData: Session;
}) {
  const {conn} = useWSCtx();

  async function handleUpdateReminder(status: "INPROGRESS" | "CANCELLED") {
    try {
      await backendAPI.patch(`/api/applications/application/${applicationData.application.id}/reminders`, {
        id: reminder.id,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        }
      });
      toast.success("Cập nhật lịch hẹn thành công");
      conn?.send(JSON.stringify({
        type: "REMINDER_UPDATE_STATUS",
        payload: {
          id: reminder.id,
          userId: sessionData.user.user.id,
          status,
        },
      }));
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi cập nhật lịch hẹn");
    }
  }

  return (
    <Card className="max-w-full flex flex-row flex-nowrap items-center gap-1 px-1 py-2">
      <Avatar>
        <AvatarImage/>
        <AvatarFallback>{sessionData.user.user.lastName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-grow max-w-[128px] md:max-w-[180px] lg:max-w-[235px]">
        <CardHeader className="flex-row items-center justify-between p-0">
          <CardTitle className="text-lg">{reminder.title}</CardTitle>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="m-0 p-0 focus-visible:ring-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Action</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Thay đổi</DropdownMenuItem>
            <DropdownMenuItem>Hủy lịch hẹn</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-row items-center gap-1">
            <span className={clsx(
              "w-2 h-2 rounded-full",
              reminder.status === "PENDING" ? "bg-gray-500" : reminder.status === "COMPLETED" ? "bg-green-500" : "bg-red-500"
            )}/>
            <span className="text-xs font-thin">{reminder.status}</span>
          </div>
          {(reminder.status === "PENDING" && sessionData.user.user.id !== reminder.creatorId) ? (
            <div className="flex flex-row items-center gap-2">
              <Button 
                variant="outline" className="px-2 py-1"
                onClick={() => handleUpdateReminder("CANCELLED")}
              >
                Cancel
              </Button>
              <Button 
                className="px-2 py-1"
                onClick={() => handleUpdateReminder("INPROGRESS")}
              >
                Accept
              </Button>
            </div>
          ) : (
            <p className="text-xs font-light max-w-full truncate overflow-hidden pr-4">{reminder.note}</p>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
