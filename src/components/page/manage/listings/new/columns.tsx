import Property, { PropertyType, mapPropertyTypeToText } from "@/models/property";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";
import { IoIosMore } from "react-icons/io";
import { Checkbox } from "@/components/ui/checkbox";

export const columns: ColumnDef<Property>[] = [
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
    cell: (cellProp) => {
      const name = cellProp.row.getValue('name');
      const media = cellProp.row.original.media;

      return (
        <div className="flex">
          <div className="w-10 h-10 rounded-sm md:rounded-md">
            <img 
              src={media[0].url} 
              alt="" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="ml-2">
            <div className="font-bold">{name as string}</div>
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: 'type',
    header: 'Loại',
    cell: ({row}) => {
      const value = row.getValue('type');
      return <span className="capitalize">{mapPropertyTypeToText[value as PropertyType]}</span>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'area',
    header: 'Diện tích',
  },
  {
    accessorKey: 'fullAdress',
    header: 'Địa chỉ',
  },
  {
    accessorKey: 'orientation',
    header: 'Hướng nhà',
  },
  {
    accessorKey: 'yearBuilt',
    header: 'Năm xây dựng',
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
    sortingFn: (rowA: Row<Property>, rowB: Row<Property>, columnId: string) => {
      const a = new Date(rowA.getValue(columnId));
      const b = new Date(rowB.getValue(columnId));
      const d = a.getTime() - b.getTime();
      return (d < 0 ? -1 : d === 0 ? 0 : 1);
    },
    header: () => (<span>Updated At</span>),
    cell: ({row}) => {
      const value = new Date(row.getValue('createdAt'));
      return format(value, 'dd/MM/yyyy HH:mm:ss');
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const property = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IoIosMore size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(property.id);
                toast.success('Coppied to clipboard');
              }}
            >
              Copy property id
            </DropdownMenuItem>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="text-red-500">Delete</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
];
