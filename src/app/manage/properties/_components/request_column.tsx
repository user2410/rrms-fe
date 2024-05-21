"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ManagedNewPropertyManagerRequest } from "./new_manager_requests";
import { toViTimeString } from "@/utils/time";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { getUserAvatarFallback, getUserFullName } from "@/models/user";
import Link from "next/link";
import RequestAction from "./request_action";
import { Session } from "next-auth";
import Image from "next/image";
import { getPrimaryImage, getPropertyFullAddress } from "@/models/property";

export function newRequestColumns(sessionData: Session, refetch: () => void): ColumnDef<ManagedNewPropertyManagerRequest>[] {
  return ([
    ...approvedRequestColumns,
    {
      header: "Hành động",
      cell: ({ row }) => (
        <RequestAction
          request={row.original.request}
          sessionData={sessionData}
          refetch={refetch}
        />
      ),
    }
  ]);
}

export const approvedRequestColumns: ColumnDef<ManagedNewPropertyManagerRequest>[] = [
  {
    accessorKey: "request.id",
    header: "#"
  },
  {
    header: "Nhà cho thuê",
    cell: ({ row }) => {
      const property = row.original.property;
      return (
        <Link
          target="_blank"
          href={`/manage/properties/property/${property.id}`}
          className="flex flex-row items-center gap-2"
        >
          <div className="relative aspect-square w-10 h-10">
            <Image
              src={getPrimaryImage(property)}
              fill
              alt={property.name}
            />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-semibold">{property.name}</h4>
            <p className="text-xs font-light">{getPropertyFullAddress(property)}</p>
          </div>
        </Link>
      );
    },
  },
  {
    header: "Ngừoi mời",
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-1">
        <Avatar>
          <AvatarFallback>{getUserAvatarFallback(row.original.creator)}</AvatarFallback>
        </Avatar>
        {getUserFullName(row.original.creator)}
      </div>
    ),
  },
  {
    accessorKey: "",
    header: "Thời gian",
    cell: ({ row }) => (
      <p>
        {toViTimeString(row.original.request.createdAt)}
      </p>
    ),
  },
];
