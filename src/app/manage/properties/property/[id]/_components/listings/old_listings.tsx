import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TableSkeleton from "./skeleton";
import { DataTable } from "./datatable";
import { columns } from "./columns";

export default function OldListings({
  property,
} : {
  property: Property;
}) {
  const session = useSession();
  const router = useRouter();
  
  const query = useQuery<Listing[]>({
    queryKey: ["manage", "properties", "property", property.id, "listings", "old"],
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
            Authorization: `Bearer ${session.data!.user.accessToken}`,
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
          <CardTitle className="text-xl">Tin đăng cũ</CardTitle>
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
