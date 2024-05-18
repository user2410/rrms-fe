import { ListingFormValues } from "@/app/manage/listings/new/page";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Property } from "@/models/property";
import { ColumnDef, ColumnFiltersState, Row, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import DataTablePagination from "../../../../../components/ui/table/data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { FormValues } from "../page";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function PropertyTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const form = useFormContext<FormValues>();

  const [sorting, setSorting] = useState<SortingState>([
    {id: "createdAt", desc: true}
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    "id": false,
    "yearBuilt": false,
    "createdAt": false,
    "updatedAt": false,
  });
  const [rowSelection, setRowSelection] = useState((() => {
    const o = {};
    o[form.getValues("propertyId") as keyof typeof o] = true as never;
    // console.log("o", o);
    return o;
  })());
  
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getRowId: (originalRow: TData, index: number, parent?: Row<TData>) => {
      return (originalRow as Property).id;
    },
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  useEffect(() => {
    // console.log("rowSelection", rowSelection);
    const selectedRows = Object.keys(rowSelection);
    if(selectedRows.length === 0) {
      form.setValue("propertyId", "");
    } else {
      form.setValue("propertyId", selectedRows[0]);
    }
  }, [rowSelection]);

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        inputFilter={{
          column: "name",
          placeholder: "Filter name..."
        }}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
