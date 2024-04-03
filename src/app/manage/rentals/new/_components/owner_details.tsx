import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { useDataCtx } from "../_context/data.context";
import { FormValues } from "../page";
import { User } from "@/models/user";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link";
import { FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

export default function OwnerDetails() {
  const form = useFormContext<FormValues>();
  const { owners, managers } = useDataCtx();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Bên cho thuê</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chủ nhà</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {owners.map((o, i) => (
            <UserItem key={i} user={o} />
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quản lý</CardTitle>
        </CardHeader>
        <CardContent>
          {managers.length === 0 && (
            <p className="w-full flex flex-row items-center py-3 px-2">Không có quản lý nào</p>
          )}
          {managers.map((m, i) => (
            <UserItem key={i} user={m} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

function UserItem({
  user,
}: {
  user: User;
}) {
  return (
    <div className="w-full border shadow-sm flex flex-row items-center py-3 px-2">
      <div className="flex flex-row items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar>
                <AvatarImage src={user.avatar}/>
                <AvatarFallback>{`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent className="w-[400px]">
              <div className="flex flex-row gap-2">
                <Avatar>
                  <AvatarImage src={user.avatar}/>
                  <AvatarFallback>{`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <span className="font-semibold">{`${user.firstName} ${user.lastName}`}</span>
                  <div className="flex flex-col gap-2">
                    {user.phone && (
                      <Link href={`tel:${user.phone}`} className="flex flex-row items-center gap-2">
                        <FaPhone size={12} color="green" />
                        {user.phone}
                      </Link>
                    )}
                    {user.email && (
                      <Link href={`mailto:${user.email}`} className="flex flex-row items-center gap-2">
                        <IoMdMail size={12} color="red" />
                        {user.email}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="font-semibold">{`${user.firstName} ${user.lastName}`}</span>
      </div>
    </div>
  );
}
