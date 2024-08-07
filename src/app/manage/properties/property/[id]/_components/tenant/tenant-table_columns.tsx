
import UnitDialog from "@/components/complex/unit_dialog";
import { ColumnDef } from "@tanstack/react-table";
import { addMonths } from "date-fns";
import { RentalExtended } from "../tenants";
import Link from "next/link";

export const tenantTColumns: ColumnDef<RentalExtended>[] = [
  {
    accessorKey: 'tenantName',
    header: 'Tên',
  },
  {
    header: 'Phòng/căn hộ',
    cell: ({ row }) => {
      const unit = row.original.unit;
      return (
        <UnitDialog unit={unit} />
      );
    }
  },
  {
    accessorKey: 'startDate',
    header: 'Ngày bắt đầu thuê',
    cell: ({ row }) => {
      const value = new Date(row.getValue('startDate'));
      return value.toLocaleDateString("vi-VN");
    }
  },
  {
    header: "Ngày hết hạn",
    cell: ({ row }) => {
      const { startDate, rentalPeriod } = row.original;
      const endDate = addMonths(new Date(startDate), rentalPeriod);
      return endDate.toLocaleDateString("vi-VN");
    }
  },
  {
    id: "action",
    cell: ({ row }) => {
      return (
        <Link href={`/manage/rentals/rental/${row.original.id}`}>Xem chi tiết</Link>
      );
    },
  },
];
