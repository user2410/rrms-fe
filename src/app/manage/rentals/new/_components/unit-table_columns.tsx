import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Unit, mapUnitTypeToText } from "@/models/unit";

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
          {unit.numberOfBedrooms > 0 && (<li>{unit.numberOfBedrooms} Phòng ngủ</li>)}
          {unit.numberOfBathrooms > 0 && (<li>{unit.numberOfBathrooms} Phòng tắm</li>)}
          {unit.numberOfToilets > 0 && (<li>{unit.numberOfToilets} Nhà vệ sinh</li>)}
          {unit.numberOfBalconies > 0 && (<li>{unit.numberOfBalconies} Ban công</li>)}
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
