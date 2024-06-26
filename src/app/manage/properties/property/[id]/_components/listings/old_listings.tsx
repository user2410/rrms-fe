import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { columns } from "./columns";
import { DataTable } from "./datatable";
import TableSkeleton from "./skeleton";

export default function OldListings({
  property,
} : {
  property: Property;
}) {
  const session = useSession();
  
  const query = useQuery<Listing[]>({
    queryKey: ["manage", "properties", "property", property.id, "listings", "old", session.data!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<Listing[]>(
        `/api/properties/property/${queryKey.at(3)}/listings`, 
        {
          params: {
            fields: "title,priority,units,active,created_at,expired_at",
            expired: true,
            limit: 5,
            offset: 0,
          },
          headers: {
            Authorization: `Bearer ${queryKey.at(-1)}`,
          },
        }
      )).data || ([]);
    },
    enabled: session.status === "authenticated",
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 1 * 60 * 1000, // 1 minute
  });

  return (
    <Card className="col-span-2">
        <CardHeader>
          Tin đăng cũ
        </CardHeader>
        <CardContent>
          {(query.isLoading || query.isError) ? (
            <TableSkeleton />
          ) : query.data.length === 0 ? (
            <div className="w-full flex flex-col justify-center items-center gap-3">
              Không có tin đăng nào
            </div>
          ) : (
            <DataTable columns={columns} data={query.data} />
          )}
        </CardContent>
      </Card>
  );
};
