import { ScrollArea } from "@/components/ui/scroll-area";
import EventCard from "./event_card";
import { ManagedApplication } from "@/models/application";
import { Session } from "next-auth";
import { Event } from "@/models/event";

const events : Event[] = [
  {
    id: 1,
    name: "Event 1",
    description: "Event 1 description emet dolorer sit amet, consectetur adipiscing elit. Nulla",
    startAt: new Date("2024-03-15T03:02:15.873Z"),
    endAt: new Date("2024-03-15T03:02:15.873Z"),
    location: "Event 1 location",
    createdAt: new Date("2024-03-14T03:02:15.873Z"),
    updatedAt: new Date("2024-03-14T10:02:16.873Z"),
    createdBy: "e0a8d123-c55b-4230-91e8-bd1b7b762366",
    status: "PENDING",
  },
  {
    id: 2,
    name: "Event 2",
    description: "Event 2 description emet dolorer sit amet, consectetur adipiscing elit. Nulla",
    startAt: new Date("2024-02-15T03:02:15.873Z"),
    endAt: new Date("2024-02-15T03:02:15.873Z"),
    location: "Event 1 location",
    createdAt: new Date("2024-01-14T03:02:15.873Z"),
    updatedAt: new Date("2024-01-14T10:02:16.873Z"),
    createdBy: "e0a8d123-c55b-4230-91e8-bd1b7b762366",
    status: "ACTIVE",
  },
];

export default function EventList({
  data,
  sessionData,
} : {
  data: ManagedApplication;
  sessionData: Session;
}) {
  return (
    <ScrollArea className="max-w-full flex-grow bg-card">
      {events.map((event) => (
        <div key={event.id} className="max-w-full">
          <EventCard
            event={event}
            data={data}
            sessionData={sessionData}
          />
        </div>
      ))}
    </ScrollArea>
  );
};
