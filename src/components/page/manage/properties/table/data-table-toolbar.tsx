"use client";

import { RxCross2 } from "react-icons/rx";
import { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "../../../../ui/table/data-table-view-options";

import { DataTableFacetedFilter } from "../../../../ui/table/data-table-faceted-filter"

interface DataTableOptionalFilter {
  column: string,
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

interface DataTableInputFilter {
  column: string,
  placeholder?: string
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  optionalFilters: DataTableOptionalFilter[];
  inputFilter: DataTableInputFilter;
}

export function DataTableToolbar<TData>({
  table,
  inputFilter,
  optionalFilters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

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
        {optionalFilters.map((item, idx) => (
          <DataTableFacetedFilter
            key={idx}
            column={table.getColumn(item.column)}
            title={item.title}
            options={item.options}
          />
        ))}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <RxCross2 className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
