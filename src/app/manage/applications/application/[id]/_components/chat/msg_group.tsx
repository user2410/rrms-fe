import { ManagedApplication } from "@/models/application";
import { MsgGroup } from "@/models/message";
import { Session } from "next-auth";
import { useEffect } from "react";
import { useMessageCtx } from "../../_context/messages.context";
import { useReminderCtx } from "../../_context/reminders.context";
import { Event, useWSCtx } from "../../_context/ws.context";
import MessageList from "./message_list";

const maxRetries = 5;

export default function MessageGroup({
  applicationData,
  sessionData,
  msgGroup,
}: {
  applicationData: ManagedApplication;
  sessionData: Session;
  msgGroup: MsgGroup;
}) {
  const wsEndpoint = `${process.env.NEXT_PUBLIC_WS_BACKEND_URL}/ws/chat/${msgGroup.groupId}?token=${sessionData.user.accessToken}`;

  const { setConn, reset: resetConn, addEvent } = useWSCtx();
  const { addMessage, resetMessages } = useMessageCtx();
  const { addReminder, resetReminders } = useReminderCtx();

  function connect(): WebSocket | null {
    const _ws = new WebSocket(wsEndpoint);
    if (_ws.OPEN) {
      console.log("connected to ws");
      setConn(_ws);
      setupWSConn(_ws);
      return _ws;
    }
    return null;
  }

  function setupWSConn(conn: WebSocket) {
    conn.onmessage = (e) => {
      const event: Event = JSON.parse(e.data);
      console.log("new event", event);
      addEvent(event);
      switch (event.type) {
        case "CHAT_CREATE_MESSAGE":
          addMessage(event.payload);
          break;
        case "REMINDER_CREATE":
          addReminder(event.payload);
          break;
        default:
      }
    };
    conn.onclose = (ev) => {
      console.log("ws closed on event:", ev);
      resetConn();
      var retries = 0;
      var newWs: WebSocket | null = null;
      while (retries < maxRetries) {
        newWs = connect();
        if (!newWs) {
          retries = retries + 1;
        } else {
          break;
        }
      }
      setConn(newWs);
      if (!newWs) {
        console.error("ws connection failed after max retries");
      }
      // resetMessages();
      // resetReminders();
    };

    conn.onerror = (e) => {
      console.error("ws error:", e);
    };
  }

  useEffect(() => {
    const _ws = new WebSocket(wsEndpoint);
    if (_ws.OPEN) {
      console.log("connected to ws");
      setConn(_ws);
    }
    setupWSConn(_ws);
    return () => {
      _ws.close();
      resetConn();
    };
  }, []);

  return (
    <MessageList
      sessionData={sessionData}
      applicationData={applicationData}
      msgGroup={msgGroup}
    />
  );
};
