import { SearchResult } from "@/models/listing";
import { Card, CardHeader } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function PostedBy({
  listing,
  preview,
} : {
  listing: Listing;
  preview?: boolean;
}) {
  // get number of listings by the same creator
  const query = useQuery<SearchResult>({
    queryKey: ['listings', 'listing', 'posted-by', listing.id],
    queryFn: async () => {
      return (await backendAPI.get<SearchResult>("/api/listings/search", {
        params: {
          lcreatorId: listing.creatorId,
          pisPublic: true,
          limit: 100000,
        },
      })).data;
    },
    enabled: !preview && !!listing.creatorId,
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  return (
    <Card>
      <CardHeader className="flex flex-col justify-center gap-3">
        <div className="space-y-2">
          <h4 className="text-sm font-thin text-center">Đăng bởi</h4>
          <div className="flex flex-col items-center gap-1">
            <Avatar>
              <AvatarFallback>{(() => {
                const names = listing.fullName.split(' ');
                const firstName = names[0];
                const lastName = names[names.length - 1];
              
                return `${firstName[0]}${lastName[0]}`;
              })()}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-center">
              {listing.fullName} 
              <span className="font-normal ml-2">{listing.contactType === "owner" ? "(chủ nhà)" : listing.contactType === "manager" ? "(quản lý)" : "(môi giới)"}</span>
            </h3>
          </div>
          {query.isSuccess && (
            <div className="text-center">
              <Link 
                href={`/search?q=${encodeURIComponent(JSON.stringify({
                  ptypes: [],
                  pfeatures: [],
                  uamenities: [],
                  lcreatorId: listing.creatorId,
                }))}`}
              >
                Xem thêm {query.data.count} tin khác
              </Link>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Link href={`tel:${listing.phone}`} className="flex flex-row justify-center items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Phone className="w-4 h-4" />
            {listing.phone}
          </Link>
          <Link href={`mailto:${listing.email}`} className="flex flex-row justify-center items-center gap-2 px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
            <Mail className="w-4 h-4" />
            {listing.email}
          </Link>
        </div>
      </CardHeader>
    </Card>
  );
}
