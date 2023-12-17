"use client";

import { columns } from "./_components/table/columns";
import { DataTable } from "./_components/data-table";
import { mockupProperties } from "@/models/property";
import wait from "@/models/wait-fn";
import { useQuery } from "@tanstack/react-query";

export default function PropertiesPage() {
  const propertiesQuery = useQuery({
    queryKey: ["my-properties"],
    queryFn: () => wait(1000).then(() => [...mockupProperties]),
  });
  
  if (propertiesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (propertiesQuery.isError) {
    return <div>Error: <pre>{JSON.stringify(propertiesQuery.error)}</pre></div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <span className="font-light text-md">Properties /</span>
        <span className="font-bold text-lg"> My properties </span>
      </div>
      <DataTable columns={columns} data={propertiesQuery.data} />
    </div>
  );
}
