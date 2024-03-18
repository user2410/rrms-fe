import { ManagedApplication } from "@/models/application";
import { Message, MsgGroup } from "@/models/message";
import { Session } from "next-auth";
import EventList from "./event_list";
import MessageList from "./message_list";
import { useEffect, useState } from "react";
import { Event, useWSCtx } from "../../_context/ws.context";

export default function MessageGroup({
  applicationData,
  sessionData,
  msgGroup,
}: {
  applicationData: ManagedApplication;
  sessionData: Session;
  msgGroup: MsgGroup;
}) {
  const {conn, setConn, resetConn, addEvent} = useWSCtx();

  function setupWSConn(conn: WebSocket) {
    conn.onmessage = (e) => {
      const data : Event = JSON.parse(e.data);
      console.log("new event", data);
      addEvent(data);
    };
    conn.onclose = () => {
      resetConn();
    };
    conn.onerror = (e) => {
      console.error(e);
    };
  }

  useEffect(() => {
    const _ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_BACKEND_URL}/ws/chat/${msgGroup.groupId}?token=${sessionData.user.accessToken}`
    );
    if(_ws.OPEN) {
      console.log("connected to ws");
      setConn(_ws);
    }
    setupWSConn(_ws);
    return () => {
      _ws.close();
      resetConn();
    };
  }, []);

  useEffect(() => {
    console.log("ws conn set", conn);
  }, [conn]);

  return (
    <div className="h-[50vh] grid grid-cols-9 gap-2">
      <div className="col-span-2 flex flex-col gap-2">
        <EventList sessionData={sessionData} data={applicationData} />
      </div>
      <MessageList 
        sessionData={sessionData} 
        applicationData={applicationData} 
        msgGroup={msgGroup}
      />
    </div>
  );
};
