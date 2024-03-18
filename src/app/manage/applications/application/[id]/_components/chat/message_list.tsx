import { ScrollArea } from "@/components/ui/scroll-area";
import { ManagedApplication } from "@/models/application";
import { Message, MsgGroup } from "@/models/message";
import { Session } from "next-auth";
import MessageItem from "./message_item";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, RotateCcw, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { backendAPI } from "@/libs/axios";
import Spinner from "@/components/ui/spinner";
import { useWSCtx } from "../../_context/ws.context";
import { MeasureMemoryMode } from "vm";

const defaultLimit = 10;
const defaultOffset = 0;

export default function MessageList({
  applicationData,
  sessionData,
  msgGroup,
}: {
  applicationData: ManagedApplication;
  sessionData: Session;
  msgGroup: MsgGroup;
}) {
  const [limit, setLimit] = useState<number>(defaultLimit);
  const [offset, setOffset] = useState<number>(defaultOffset);
  const [oldMessages, setOldMessages] = useState<Message[]>([]);

  const { conn, events } = useWSCtx();

  const [showLoadMore, setShowLoadMore] = useState<boolean>(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const query = useQuery<Message[]>({
    queryKey: ["manage", "applications", "application", applicationData.application.id.toString(), "msg-group", msgGroup.groupId.toString()] as string[],
    queryFn: async ({ queryKey }) => {
      var ms = (await backendAPI.get<Message[]>(`/api/chat/group/${queryKey.at(5)}/messages`, {
        params: {
          limit,
          offset,
        },
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data;
      ms = ms || ([] as Message[]);
      setOldMessages(ms);
      if (ms.length < limit) {
        setShowLoadMore(false);
      }
      return ms;
    },
    staleTime: 1000 * 60 * 60,
    cacheeTime: 1000 * 60 * 60,
  });

  const messages = useMemo<Message[]>(() => {
    return [
      ...oldMessages,
      ...events.filter(e => e.type === "CHAT_CREATE_MESSAGE").map(e => (e.payload as Message)),
    ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [oldMessages, events]);

  useEffect(() => {
    // scroll to bottom
    if (!scrollAreaRef?.current) return;
    console.log("scroll to bottom");
    console.log(scrollAreaRef.current.scrollTop, scrollAreaRef.current.scrollHeight);
    scrollAreaRef.current.scrollTo({
      top: scrollAreaRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [scrollAreaRef]);

  useEffect(() => {
    if (!textInputRef.current) return;
    textInputRef.current.addEventListener("focus", () => {
      console.log("focus on text input");
      conn?.send(JSON.stringify({ type: "CHAT_TYPING" }));
    });
  }, [textInputRef]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const textMsg = (e.target as any)[2].value;
    // console.log(e);
    // console.log("file:", e.target[1].value); // file path
    console.log("text msg:", textMsg);
    console.log(conn);
    conn?.send(JSON.stringify({
      type: "CHAT_CREATE_MESSAGE",
      payload: {
        content: textMsg,
        type: "TEXT",
      },
    }));
    if (textInputRef.current) {
      textInputRef.current.value = "";
    }
  }

  function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    Object.entries(event.target.files!).forEach((e) => {
      const { name, size, type } = e[1];
      // URL.createObjectURL(e[1])
    });
  }

  async function handleShowMore() {
    try {
      const ms = (await backendAPI.get<Message[]>(`/api/chat/group/${msgGroup.groupId}/messages`, {
        params: {
          limit,
          offset: offset + limit,
        },
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data;
      setOldMessages(v => [...v, ...ms]);
      if (ms.length < limit) {
        setShowLoadMore(false);
      }
      setOffset(offset + limit);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="col-span-7 flex flex-col gap-2">
      <ScrollArea
        ref={scrollAreaRef}
        className="bg-card min-h-[50vh]"
        onScroll={(e) => { console.log(e.currentTarget.offsetTop); }}
      >
        {query.isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : query.isError ? (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-red-500">Lỗi khi tải dữ liệu</p>
          </div>
        ) : (
          <>
            {showLoadMore && (
              <div className="flex flex-row justify-center p-4">
                <Button
                  variant="outline" className="flex flex-row items-center gap-2 px-4 py-2"
                  onClick={handleShowMore}
                >
                  <RotateCcw className="w-4 h-4" />
                  Load more
                </Button>
              </div>
            )}
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                sessionData={sessionData}
                msgGroup={msgGroup}
              />
            ))}
          </>
        )}
      </ScrollArea>
      <form
        className="flex flex-row items-center gap-1"
        action="POST"
        onSubmit={handleSubmit}
      >
        <button type="button" className="border-none" onClick={() => {
          console.log("open create image modal");
          fileInputRef.current?.click();
        }}>
          <ImageIcon className="w-6 h-6 text-blue-400" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={false}
          hidden
          onChange={handleFileInputChange}
        />
        <Input
          ref={textInputRef}
          className="flex-grow min-h-[32px]"
          placeholder="Tin nhắn ..." />
        <button type="submit" className="border-none" onClick={() => console.log("submit message")}>
          <Send className="w-6 h-6 text-blue-400" />
        </button>
      </form>
    </div>
  );
};
