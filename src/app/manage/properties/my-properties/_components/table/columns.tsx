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
import { DataTableColumnHeader } from "./data-table-column-header";

export const columns: ColumnDef<Property>[] = [
  {
    accessorKey: 'id',
    header: 'ID'
  },
  {
    accessorKey: 'name',
    header: 'Name',
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
    header: 'Property type',
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
    header: 'Area',
  },
  {
    accessorKey: 'fullAdress',
    header: 'Address',
  },
  {
    accessorKey: 'orientation',
    header: 'Orientation',
  },
  {
    accessorKey: 'yearBuilt',
    header: 'Year Built',
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
    header: ({column}) => {
      return (
        // <Button
        //   variant="ghost"
        //   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        // >
        //   Updated At
        //   <IoIosArrowDown size={16} className="ml-2 h-4 w-4" />
        // </Button>
        <DataTableColumnHeader column={column} title="Updated At" />
      )
    },
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
