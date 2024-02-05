import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Unit } from "@/models/unit";
import toast from "react-hot-toast";
import { IoIosMore } from "react-icons/io";

export const unitTColumns: ColumnDef<Unit>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Tên',
  },
  {
    accessorKey: 'floor',
    header: 'Tầng',
  },
  {
    accessorKey: 'area',
    header: 'Diện tích',
  },
  {
    header: 'Phòng ốc',
    cell: ({row}) => {
      const unit = row.original;
      return (
        <ul className="flex flex-col flex-wrap gap-2 list-disc list-inside">
          {unit.numberOfLivingRooms && (<li>{unit.numberOfLivingRooms} Phòng khách</li>)}
          {unit.numberOfBedrooms && (<li>{unit.numberOfBedrooms} Phòng ngủ</li>)}
          {unit.numberOfBathrooms && (<li>{unit.numberOfBathrooms} Phòng tắm</li>)}
          {unit.numberOfKitchens && (<li>{unit.numberOfKitchens} Phòng bếp</li>)}
          {unit.numberOfToilets && (<li>{unit.numberOfToilets} Nhà vệ sinh</li>)}
          {unit.numberOfBalconies && (<li>{unit.numberOfBalconies} Ban công</li>)}
        </ul>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({row}) => {
      const value = new Date(row.getValue('createdAt'));
      return format(value, 'dd/MM/yyyy HH:mm:ss');
    }
  },
  {
    accessorKey: 'updatedAt',
    sortingFn: (rowA: Row<Unit>, rowB: Row<Unit>, columnId: string) => {
      const a = new Date(rowA.getValue(columnId));
      const b = new Date(rowB.getValue(columnId));
      const d = a.getTime() - b.getTime();
      return (d < 0 ? -1 : d === 0 ? 0 : 1);
    },
    header: () => (<span>Cập nhật</span>),
    cell: ({row}) => {
      const value = new Date(row.getValue('createdAt'));
      return format(value, 'dd/MM/yyyy HH:mm:ss');
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const unit = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IoIosMore size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
