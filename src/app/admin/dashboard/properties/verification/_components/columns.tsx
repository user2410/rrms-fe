import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserAvatarFallback, getUserFullName } from "@/models/user";
import { ColumnDef } from "@tanstack/react-table";
import { Session } from "next-auth";
import { RequestItem } from "../page";
import Item from "./item";

export function columns(sessionData: Session, refresh: () => void): ColumnDef<RequestItem>[] {
  return ([
    {
      header: "#",
      accessorKey: "request.id",
    },
    {
      header: "Nhà cho thuê",
      accessorKey: "property.name",
    },
    {
      header: "Người tạo",
      cell: ({ row }) => {
        const creator = row.original.creator;
        return (
          <div className="flex flex-row items-center gap-1">
            <Avatar>
              <AvatarFallback>{getUserAvatarFallback(creator)}</AvatarFallback>
            </Avatar>
            <span>{getUserFullName(creator)}</span>
          </div>
        );
      },
    },
    {
      accessorFn: (row) => {
        const createdAt = new Date(row.request.createdAt);
        return `${createdAt.toLocaleDateString("vi-VN")} ${createdAt.toLocaleTimeString("vi-VN")}`;
      },
      header: "Thời gian tạo",
    },
    {
      header: "Trạng thái",
      accessorFn: (row) => (row.request.status === "PENDING" ? "Đang chờ" : row.request.status === "APPROVED" ? "Đã xác minh" : "Từ chối"),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Item 
          item={row.original} sessionData={sessionData} 
          refresh={refresh}
        />
      ),
    }
  ]);
}