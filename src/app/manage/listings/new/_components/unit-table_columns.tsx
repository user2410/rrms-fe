import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Unit, mapUnitTypeToText } from "@/models/unit";
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
    accessorKey: 'type',
    header: 'Loại',
    cell: ({ row }) => {
      const unit = row.original;
      
      return (<>{mapUnitTypeToText[unit.type as keyof typeof mapUnitTypeToText]}</>);
    },
  },
  {
    header: 'Phòng ốc',
    cell: ({row}) => {
      const unit = row.original;
      return (
        <ul className="flex flex-col flex-wrap gap-2 list-disc list-inside">
          {unit.numberOfBedrooms && (<li>{unit.numberOfBedrooms} Phòng ngủ</li>)}
          {unit.numberOfBathrooms && (<li>{unit.numberOfBathrooms} Phòng tắm</li>)}
          {unit.numberOfToilets && (<li>{unit.numberOfToilets} Nhà vệ sinh</li>)}
          {unit.numberOfBalconies && (<li>{unit.numberOfBalconies} Ban công</li>)}
        </ul>
      );
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const unit = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <IoIosMore size={16} />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   }
  // }
];
