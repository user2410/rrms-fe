import { Button } from "@/components/ui/button";
import { backendAPI } from "@/libs/axios";
import { Listing, mockupListings } from "@/models/listing";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Data } from "../page";
import { columns } from "./listings/columns";
import { DataTable } from "./listings/datatable";
import TableSkeleton from "./listings/skeleton";
import { useSession } from "next-auth/react";

export default function Listings({
  data,
}: {
  data: Data;
}) {
  const router = useRouter();
  const session = useSession();

  const listingsQueries = useQuery<Listing[]>({
    queryKey: ['manage', 'properties', 'property', data.property.id, 'listings'],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<Listing[]>(
        `/api/properties/property/${queryKey.at(3)}/listings`, { 
          headers: {
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
        })
      ).data;
    },
    enabled: session.status === 'authenticated',
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 1 * 60 * 1000, // 1 minute
  });
  
  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Danh sách tin đăng</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your listings!
          </p>
        </div>
        <div>
          <Button onClick={() => router.push(`/manage/listings/new?propertyId=${data.property.id}`)}>Tạo tin đăng mới</Button>
        </div>
      </div>
      {(listingsQueries.isLoading || listingsQueries.isError) ? (
        <TableSkeleton/>
      ) : (
        <DataTable columns={columns} data={listingsQueries.data} />
      ) }
    </div>
  );
};
