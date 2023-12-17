"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@components/ui/table/data-table-view-options";

interface DataTableInputFilter {
  column: string,
  placeholder?: string
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  inputFilter: DataTableInputFilter;
}

export function DataTableToolbar<TData>({
  table,
  inputFilter,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={inputFilter.placeholder && `Filter ${inputFilter.column}...`}
          value={(table.getColumn(inputFilter.column)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(inputFilter.column)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
