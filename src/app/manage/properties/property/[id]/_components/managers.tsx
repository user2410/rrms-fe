import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { getUserAvatarFallback, getUserFullName, User } from "@/models/user";
import { useQuery } from "@tanstack/react-query";
import { usePropDataCtx } from "../_context/property_data.context";
import InviteManagerDialog from "./invite_manager.dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BiDotsHorizontal } from "react-icons/bi";
import { ChevronsUp } from "lucide-react";

export default function Managers() {
  const { property, sessionData } = usePropDataCtx();
  const ids = property.managers.map(m => m.managerId);
  const query = useQuery<User[]>({
    queryKey: ["manage", "properties", "property", property.id, "managers", sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<User[]>('/api/auth/credential/ids', {
        params: {
          ids,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
    },
    cacheTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div>
      <Card>
        <CardHeader>
          Chủ nhà
        </CardHeader>
        {query.isLoading ? (
          <CardContent className="w-full flex flex-row justify-center items-center">
            <Spinner size={32} />
          </CardContent>
        ) : query.isError ? (
          <CardContent className="w-full flex flex-row justify-center items-center">
            Đã có lỗi xảy ra
          </CardContent>
        ) : (
          <CardContent className="space-y-3">
            {property.managers
              .filter(m => m.role === "OWNER")
              .map((m, i) => {
                const user = query.data.find(u => u.id === m.managerId)!;
                return (
                  <div key={i} className="w-full border shadow-sm py-3 px-2">
                    <div className="flex flex-row items-center gap-2">
                      <Avatar>
                        <AvatarImage src="/img/avatar_placeholder" />
                        <AvatarFallback>{getUserAvatarFallback(user)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{getUserFullName(user)}</span>
                    </div>
                  </div>
                );
              })}
          </CardContent>
        )}
      </Card>
      <Card>
        <CardHeader className="flex-row justify-between items-center">
          <>Người quản lý</>
          {query.isSuccess && (
            <InviteManagerDialog users={query.data} />
          )}
        </CardHeader>
        {query.isLoading ? (
          <CardContent className="w-full flex flex-row justify-center items-center">
            <Spinner size={32} />
          </CardContent>
        ) : query.isError ? (
          <CardContent className="w-full flex flex-row justify-center items-center">
            Đã có lỗi xảy ra
          </CardContent>
        ) : (
          <CardContent className="space-y-3">
            {property.managers
              .filter(m => m.role === "MANAGER")
              .map((m, i) => {
                const user = query.data.find(u => u.id === m.managerId)!;
                return (
                  <div key={i} className="w-full flex flex-row justify-between border shadow-sm py-3 px-2">
                    <div className="flex flex-row items-center gap-2">
                      <Avatar>
                        <AvatarImage src="/img/avatar_placeholder" />
                        <AvatarFallback>{getUserAvatarFallback(user)}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{getUserFullName(user)}</span>
                    </div>
                    {property.managers.some(m => m.role === "OWNER" && m.managerId === user.id) && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                          >
                            <BiDotsHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <div className="flex flex-row items-center gap-1">
                              <ChevronsUp className="w-4 h-4"/>
                              Chuyển quyền quản lý
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <div className="flex flex-row items-center gap-1 text-red-400">
                              <ChevronsUp className="w-4 h-4"/>
                              Xóa bỏ
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                );
              })}
          </CardContent>
        )}
      </Card>
    </div>
  );
};


