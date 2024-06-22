"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { mapTenantType2Text } from "@/models/application";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { ManagedRental } from "../page";

export const aboutToExpireColumns: ColumnDef<ManagedRental>[] = [
  {
    header: "Bên thuê",
    cell: ({ row }) => {
      const { id, profileImage, tenantName, tenantType } = row.original.rental;

      return (
        <div className="flex flex-row items-center gap-2">
          <div className="w-10 h-10 relative rounded-sm md:rounded-md">
            <img
              src={profileImage}
              alt=""
              className="w-full h-full object-cover rounded-sm md:rounded-md"
            />
          </div>
          <Link href={`/manage/rentals/rental/${id}`}>
            <span className="font-bold">
              {tenantName}&nbsp;
              <span className="text-gray-400">
                {mapTenantType2Text[tenantType]}
              </span>
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    header: "Nhà cho thuê",
    cell: ({ row }) => (
      <Link href={`/manage/properties/property/${row.original.property.id}`}>{row.original.property.name}</Link>
    ),
  },
  {
    header: "Ngày bắt đầu thuê",
    cell: ({ row }) => {
      const startDate = new Date(row.original.rental.startDate);
      return startDate.toLocaleDateString("vi-VN");
    },
  },
  {
    header: "Ngày hết hạn thuê",
    cell: ({ row }) => (`${row.original.rental.expiryDate!.toLocaleDateString("vi-VN")} (${row.original.rental.timeLeft < 0 ? "Hết hạn" : `còn ${row.original.rental.timeLeft.toFixed(0)} ngày`})`),
  },
  {
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
];

export const nonExpiredColumns: ColumnDef<ManagedRental>[] = [
  {
    header: "Bên thuê",
    cell: ({ row }) => {
      const { id, profileImage, tenantName, tenantType } = row.original.rental;

      return (
        <div className="flex flex-row items-center gap-2">
          <div className="w-10 h-10 relative rounded-sm md:rounded-md">
            <img
              src={profileImage}
              alt=""
              className="w-full h-full object-cover rounded-sm md:rounded-md"
            />
          </div>
          <Link href={`/manage/rentals/rental/${id}`}>
            <span className="font-bold">
              {tenantName}&nbsp;
              <span className="text-gray-400">
                {mapTenantType2Text[tenantType]}
              </span>
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    header: "Nhà cho thuê",
    cell: ({ row }) => (
      <Link href={`/manage/properties/property/${row.original.property.id}`}>{row.original.property.name}</Link>
    ),
  },
  {
    header: "Ngày bắt đầu thuê",
    cell: ({ row }) => {
      const startDate = new Date(row.original.rental.startDate);
      return startDate.toLocaleDateString("vi-VN");
    },
  },
  {
    header: "Ngày hết hạn thuê",
    cell: ({ row }) => (`${row.original.rental.expiryDate!.toLocaleDateString("vi-VN")} (${row.original.rental.timeLeft < 0 ? "Hết hạn" : `còn ${row.original.rental.timeLeft.toFixed(0)} ngày`})`),
  },
];

export const endColumns: ColumnDef<ManagedRental>[] = [
  {
    header: "Bên thuê",
    cell: ({ row }) => {
      const { id, profileImage, tenantName, tenantType } = row.original.rental;

      return (
        <div className="flex flex-row items-center gap-2">
          <div className="w-10 h-10 relative rounded-sm md:rounded-md">
            <img
              src={profileImage}
              alt=""
              className="w-full h-full object-cover rounded-sm md:rounded-md"
            />
          </div>
          <Link href={`/manage/rentals/rental/${id}`}>
            <span className="font-bold">
              {tenantName}&nbsp;
              <span className="text-gray-400">
                {mapTenantType2Text[tenantType]}
              </span>
            </span>
          </Link>
        </div>
      );
    },
  },
  {
    header: "Nhà cho thuê",
    cell: ({ row }) => (
      <Link href={`/manage/properties/property/${row.original.property.id}`}>{row.original.property.name}</Link>
    ),
  },
  {
    header: "Ngày bắt đầu thuê",
    cell: ({ row }) => {
      const startDate = new Date(row.original.rental.startDate);
      return startDate.toLocaleDateString("vi-VN");
    },
  },
  {
    header: "Ngày hết hạn thuê",
    cell: ({ row }) => (`${row.original.rental.expiryDate!.toLocaleDateString("vi-VN")}`),
  },
  {
    header: "Trạng thái",
    cell: ({ row }) => {
      return row.original.rental.status === "END" ? "Đã kết thúc" : "Đã hết hạn";
    }, 
  }
];

export const prerentalColumns: ColumnDef<ManagedRental>[] = [
  ...nonExpiredColumns,
  {
    id: "actions",
    cell: ({row}) => (
      <Link 
        href={`/manage/rentals/prerentals/prerental/${row.original.rental.id}`}
        className={buttonVariants({variant: "default"})}
      >Chi tiết</Link>
    ),
  },
];