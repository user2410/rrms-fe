import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message, MsgGroup } from "@/models/message";
import clsx from "clsx";
import { format } from "date-fns";
import { Session } from "next-auth";
import Image from "next/image";

export default function MessageItem({
  message,
  sessionData,
  msgGroup,
}: {
  message: Message;
  sessionData: Session;
  msgGroup: MsgGroup;
}) {
  const isOwn = message.fromUser === sessionData.user.user.id;
  const user = msgGroup.members.find((m) => m.userId === message.fromUser);

  return (
    <div className={clsx("flex flex-row items-center gap-3 p-4", isOwn && "justify-end")}>
      <div className={clsx(isOwn && "order-2")}>
        <Avatar>
          <AvatarImage />
          <AvatarFallback>
            {`${user!.firstName[0]}${user!.lastName[0]}`}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className={clsx("flex flex-col gap-2", isOwn && "items-end")}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500">
            {`${user!.firstName} ${user!.lastName}`}
          </div>
          <div className="text-xs text-gray-400">
            {format(new Date(message.createdAt), "p")}
          </div>
        </div>
        <div
          className={clsx(
            "text-sm w-fit overflow-hidden",
            isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
            message.type === "IMAGE" ? "rounded-md p-0" : "rounded-full py-2 px-3"
          )}
        >
          {message.type === "IMAGE" ? (
            <Image
              alt="Image message"
              height="288"
              width="288"
              src={message.content}
              className="object-cover cursor-pointer hover:scale-110 transition translate"
            />
          ) : (
            <div>{message.content}</div>
          )}
        </div>
        {/* {isLast && isOwn && seenList.length > 0 && (
					<div className="text-xs font-light text-gray-500">
						{`Seen by ${seenList}`}
					</div>
				)} */}
      </div>
    </div>
  );
};
