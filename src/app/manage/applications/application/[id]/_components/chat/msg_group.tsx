import { ManagedApplication } from "@/models/application";
import { MsgGroup } from "@/models/message";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Event, useWSCtx } from "../../_context/ws.context";
import MessageList from "./message_list";
import ReminderList from "./reminder_list";
import { useMessageCtx } from "../../_context/messages.context";
import { useReminderCtx } from "../../_context/reminders.context";

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
  const { addReminder, updateReminderStatus, resetReminders } = useReminderCtx();

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
        case "REMINDER_UPDATE_STATUS":
          updateReminderStatus(event.payload);
          break;
        // case "CHAT_TYPING":
        // case "CHAT_DELETE_MESSAGE":
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
      if(!newWs) {
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
    <div className="grid grid-cols-9 gap-2">
      <ReminderList
        sessionData={sessionData}
        applicationData={applicationData}
      />
      <MessageList
        sessionData={sessionData}
        applicationData={applicationData}
        msgGroup={msgGroup}
      />
    </div>
  );
};
