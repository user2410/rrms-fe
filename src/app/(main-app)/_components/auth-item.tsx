"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useModalAction } from "@/context/modal.context";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment } from "react";
import toast from "react-hot-toast";

export default function AuthItem() {
  const {openModal} = useModalAction();
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
            <div className="text-sm text-foreground truncate">{session.user.user.email}</div>
            <div className="text-sm text-foreground/60 truncate">{session?.user?.user.email}</div>
          </Fragment>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href="/manage">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>My profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <Button variant="ghost" onClick={() => openModal("AUTH_VIEW")}>Sign in</Button>
  );
}
