import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Message, MsgGroup } from "@/models/message";
import { useQuery } from "@tanstack/react-query";
import { Image as ImageIcon, RotateCcw, Send } from "lucide-react";
import { Session } from "next-auth";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useMessageCtx } from "../../_context/messages.context";
import { useWSCtx } from "../../_context/ws.context";
import MessageItem from "./message_item";

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

  const { conn } = useWSCtx();
  const { messages, setMessages } = useMessageCtx();

  const [showLoadMore, setShowLoadMore] = useState<boolean>(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const query = useQuery<Message[]>({
    queryKey: ["manage", "applications", "application", applicationData.application.id.toString(), "msg-group", msgGroup.groupId],
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
      if (ms.length >= limit) {
        setShowLoadMore(true);
      }
      setMessages(ms);
      return ms;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  // const messages = useMemo<Message[]>(() => {
  //   return filterEvents<Message>([
  //     ...oldMessages,
  //     ...events.filter(e => e.type === "CHAT_CREATE_MESSAGE").map(e => (e.payload as Message)),
  //   ],
  //     "id",
  //     (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).
  //     sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  // }, [oldMessages, events]);

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
      })).data || ([] as Message[]);
      if (ms.length < limit) {
        setShowLoadMore(false);
      } else {
        setShowLoadMore(true);
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
            {messages.length === 0 && (
              <div className="w-full h-full flex justify-center items-center">
                <p className="text-xl font-thin">Không có tin nhắn nào</p>
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
        <button 
          type="button" className="border-none" 
          disabled={query.isLoading || query.isError || !conn}
          onClick={() => {
            console.log("open create image modal");
            fileInputRef.current?.click();
          }}
        >
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
          disabled={query.isLoading || query.isError || !conn}
          className="flex-grow min-h-[32px]"
          placeholder="Tin nhắn ..." />
        <button 
          type="submit" className="border-none" 
          disabled={query.isLoading || query.isError || !conn}
          onClick={() => console.log("submit message")}
        >
          <Send className="w-6 h-6 text-blue-400" />
        </button>
      </form>
    </div>
  );
};
