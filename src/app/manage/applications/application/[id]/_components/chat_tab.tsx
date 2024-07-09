import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { MsgGroup } from "@/models/message";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Link from "next/link";
import toast from "react-hot-toast";
import MessageGroup from "./chat/msg_group";
import { WSProvider } from "../_context/ws.context";
import { MessagesProvider } from "../_context/messages.context";
import { ReminderContext, RemindersProvider } from "../_context/reminders.context";

export default function ChatTab({
  data,
  sessionData,
} : {
  data: ManagedApplication;
  sessionData: Session;
}) {
  // const groupName = getApplicationMsgGroupName(data.application.id);
  const {application} = data;
  const query = useQuery<MsgGroup | null>({
    queryKey: ["manage", "applications", "application", application.id, "msg-group", sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const res = await backendAPI.get<MsgGroup | null>(
        `/api/applications/application/${queryKey.at(3)}/msg-group`, 
        {
          validateStatus: (status) => status === 200 || status === 404,
          headers: {
            Authorization: `Bearer ${queryKey.at(-1)}`,
          },
        },
      );
      if (res.status === 404) {
        return null;
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  async function handleCreateGroup() {
    try {
      await backendAPI.post(
        `/api/applications/application/${application.id}/msg-group`, 
        {},
        {
          headers: {
            Authorization: `Bearer ${sessionData.user.accessToken}`,
          },
        },
      );
      query.refetch();
    } catch(err) {
      console.error(err);
      toast.error("Lỗi khi tạo nhóm trò chuyện");
    }
  }

  return query.isLoading ? (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner />
    </div>
  ) : query.isError ? (
    <div className="w-full h-full flex justify-center items-center">
      <p className="text-red-500">Lỗi khi tải dữ liệu</p>
    </div>
  ) : !query.data ? (
    <div className="w-full h-full flex flex-col justify-center items-center gap-2">
      <Button 
        type="button" variant="outline" className="" 
        onClick={handleCreateGroup}
        disabled={sessionData.user.user.id === application.creatorId}
      >Tạo nhóm</Button>
      <p className="font-thin">Chưa có nhóm trao đổi. Tạo nhóm để bắt đầu trao đổi về nhà cho thuê. Xem <Link href="#" className="underline">Quy định nhóm trao đổi</Link>.</p>
    </div>
  ) : (
    <WSProvider>
      <MessagesProvider>
        <RemindersProvider>
          <MessageGroup 
            sessionData={sessionData} 
            applicationData={data} 
            msgGroup={query.data}
          />
        </RemindersProvider>
      </MessagesProvider>
    </WSProvider>
  );
};
