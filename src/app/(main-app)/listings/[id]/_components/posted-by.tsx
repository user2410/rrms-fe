import { SearchResult } from "@/app/(main-app)/search/page";
import { Card, CardHeader } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function PostedBy({listing} : {listing: Listing}) {
  const query = useQuery<SearchResult>({
    queryKey: ['listings', 'listing', 'posted-by', listing.id],
    queryFn: async () => {
      return (await backendAPI.get("/api/listings", {
        params: {
          lcreatorId: listing.creatorId,
          pisPublic: true,
        },
      })).data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <div className="text-sm font-thin">Đăng bởi</div>
        <h3 className="font-semibold">{listing.fullName}</h3>
        <Link href={'/'}>Xem thêm {query.data?.count} tin khác</Link>
      </CardHeader>
    </Card>
  );
}
