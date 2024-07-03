"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import toast from "react-hot-toast";
import AuthModal from "./auth.modal";
import { Gauge, User } from "lucide-react";
import { FaFile, FaHome } from "react-icons/fa";
import { getUserFullName } from "@/models/user";

export default function AuthItem() {
  const { data: session, status: sessionStat } = useSession();

  const handleSignout = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return sessionStat === "authenticated" ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="/img/avatar_placeholder.png" alt="User" />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>
          <Fragment>
            <div className="text-sm text-foreground truncate">{getUserFullName(session.user.user)}</div>
            <div className="text-sm text-foreground/60 truncate">{session?.user?.user.email}</div>
          </Fragment>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Gauge className="mr-2 h-4 w-4" />
            <Link href="/manage">Quản lý</Link>
          </DropdownMenuItem>
          {session.user.user.role === "LANDLORD" ? (
            <DropdownMenuItem>
              <FaHome size={16} className="mr-2" />
              <Link href="/manage/properties">Nhà cho thuê</Link>
            </DropdownMenuItem>
          ) : session.user.user.role === "TENANT" ? (
            <DropdownMenuItem>
              <FaFile size={16} className="mr-2" />
              <Link href="/manage/applications/to-me">Đơn ứng tuyển của tồi</Link>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem>
            <FaHome size={16} className="mr-2" />
            <Link href="/manage/rentals">Profile thuê nhà</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Link href="/manage/my-account">Profile của tôi</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout}>
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <AuthModal/>
  );
}
