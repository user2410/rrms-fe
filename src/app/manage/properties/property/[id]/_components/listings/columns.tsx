"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Listing, ListingPriorities } from "@/models/listing";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Listing>[] = [
  {
    accessorKey: "title",
    header: "Tin đăng",
    cell: (({row}) => {
      const priorityLabel = ListingPriorities.find(lp => lp.priority === row.original.priority)?.label;

      return (
        <div className="flex flex-row items-center gap-1">
          {priorityLabel && (<Badge>{priorityLabel}</Badge>)}
          <span className="max-w-[500px] text-ellipsis overflow-hidden font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    })
  },
  {
    header: "Trạng thái",
    accessorKey: "active",
    cell: ({row}) => {
      return (
        <div>{row.getValue("active") ? "Active" : "Inactive"}</div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Thời gian đăng",
    cell: ({row}) => (
      <span>{format(new Date(row.getValue("createdAt")), "hh:mm dd/MM/yyyy")}</span>
    )
  },
  {
    accessorKey: "expiredAt",
    header: "Hết hạn",
    cell: ({row}) => (
      <span>{format(new Date(row.getValue("expiredAt")), "hh:mm dd/MM/yyyy")}</span>
    )
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const listing = row.original;
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(listing.id)}
            >
              Copy ID tin đăng
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Sửa</DropdownMenuItem>
            <DropdownMenuItem>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
