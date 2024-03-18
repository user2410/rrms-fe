import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ManagedApplication } from "@/models/application";
import { Event } from "@/models/event";
import clsx from "clsx";
import { MoreVertical } from "lucide-react";
import { Session } from "next-auth";

export default function EventCard({
  event,
  data,
  sessionData,
} : {
  event: Event;
  data: ManagedApplication;
  sessionData: Session;
}) {
  return (
    <Card className="max-w-full flex flex-row flex-nowrap items-center gap-1 px-1 py-2">
      <Avatar>
        <AvatarImage/>
        <AvatarFallback>{sessionData.user.user.lastName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-grow max-w-[128px] md:max-w-[180px] lg:max-w-[235px]">
        <CardHeader className="flex-row items-center justify-between p-0">
          <CardTitle className="text-lg">{event.name}</CardTitle>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="m-0 p-0 focus-visible:ring-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Action</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-row items-center gap-1">
            <span className={clsx(
              "w-2 h-2 rounded-full",
              event.status === "PENDING" ? "bg-gray-500" : event.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
            )}/>
            <span className="text-xs font-thin">{event.status}</span>
          </div>
          {(event.status === "PENDING" && sessionData.user.user.id !== event.createdBy) ? (
            <div className="flex flex-row items-center gap-2">
              <Button variant="outline" className="px-2 py-1">Cancel</Button>
              <Button className="px-2 py-1">Accept</Button>
            </div>
          ) : (
            <p className="text-xs font-light max-w-full truncate overflow-hidden pr-4">{event.description}</p>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
