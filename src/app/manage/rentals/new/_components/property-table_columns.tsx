import { OrientationItems, Property, PropertyType, getPrimaryImage, mapPropertyTypeToText } from "@/models/property";
import { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";

import { Checkbox } from "@/components/ui/checkbox";

export const propertyTColumns: ColumnDef<Property>[] = [
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
      const property = cellProp.row.original;

      return (
        <div className="flex">
          <div className="w-10 h-10 relative rounded-sm md:rounded-md">
            <img
              src={getPrimaryImage(property)} 
              alt="" 
              className="w-full h-full object-cover rounded-sm md:rounded-md"
            />
          </div>
          <div className="ml-2">
            <div className="font-bold">{name as string}</div>
          </div>
        </div>
      );
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
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'area',
    header: 'Diện tích',
  },
  {
    accessorKey: 'fullAddress',
    header: 'Địa chỉ',
  },
  {
    accessorKey: 'orientation',
    header: 'Hướng nhà',
    cell: ({row}) => {
      const v = row.getValue('orientation');
      const o = OrientationItems.find((o) => o.value === v);
      return o ? o.label : v;
    }
  },
  {
    accessorKey: 'yearBuilt',
    header: 'Năm xây dựng',
  },
  {
    id: 'createdAt',
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
];
