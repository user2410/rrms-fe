import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { backendAPI } from "@/libs/axios";
import { Application, MapApplicationStatusToText } from "@/models/application";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import { IoMdMail } from "react-icons/io";
import ApplicationInvitation from "./application_invitation";
import { useRouter } from "next/navigation";

export default function Applications({
  listings,
  property,
  accessToken,
}: {
  listings: Listing[];
  property: Property;
  accessToken: string;
}) {
  const router = useRouter();
  const query = useQuery<Application[]>({
    queryKey: ["manage", "properties", "property", property.id, "listings", "current", "appliacations", accessToken],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<Application[]>(`/api/properties/property/${property.id}/applications`, {
        params: {
          fields: "full_name,created_at,status",
          listingIds: listings.map(l => l.id),
          limit: 1000,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
    },
    enabled: listings.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 1 * 60 * 1000, // 1 minute
  });

  return (
    <div className="space-y-3">
      <div className="flex flex-row justify-between items-end">
        <h3 className="font-semibold">Đơn ứng tuyển</h3>
        <Link
          href={`/manage/rental/applications/to-me?propertyId=${property.id}`}
          className="text-sm hover:underline"
        >
          {query.isSuccess && (
            `Xem tất cả đơn ứng tuyển (${query.data.length})`
          )}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {
          listings.length === 0 ? (
            <div className="col-span-2 min-h-[190px] flex flex-col justify-center items-center gap-3">
              <h2 className="font-bold">Không có đơn ứng tuyển nào</h2>
              <p>Tạo tin đăng mới và nhận đơn ứng tuyển</p>
              <Button onClick={() => router.push(`/manage/listings/new?propertyId=${property.id}`)}>Tạo tin đăng mới</Button>
            </div>
          ) : (query.isLoading || query.isError) ? (
            <>
              <ApplicationCardSkeleton />
              <ApplicationCardSkeleton />
              <ApplicationCardSkeleton />
              <ApplicationCardSkeleton />
            </>
          ) : query.data.length === 0 ? (
            <div className="col-span-2 min-h-[190px] flex flex-col justify-center items-center gap-3">
              <h2 className="font-bold">Không có đơn ứng tuyển nào</h2>
              <p>Bạn có thể gửi link mời ứng tuyển nhà cho thuê này</p>
              <ApplicationInvitation listings={listings}/>
            </div>
          ) : query.data.length <= 4 ? (
            query.data.map((a, i) => (
              <ApplicationCard key={i} application={a} />
            ))
          ) : (
            <>
              {query.data.slice(0, 3).map((a, i) => (
                <ApplicationCard key={i} application={a} />
              ))}
              <div className="p-4 border shadow-sm space-y-2">
                <div className="font-semibold">+ 7 đơn ứng tuyển...</div>
                <h2>Từ {query.data.slice(4, 6).map((a) => a.fullName).join(", ")}...</h2>
                <div className="flex flex-row gap-1">
                  Xem chi tiết
                  <ChevronRightCircle className="w-6 h-6" />
                </div>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
};

function ApplicationCard({ application }: { application: Application }) {
  return (
    <Link href={`/manage/applications/application/${application.id}`} className="p-4 border shadow-sm space-y-2">
      <Badge className="uppercase">
        {MapApplicationStatusToText[application.status]}
      </Badge>
      <h2>{application.fullName}</h2>
      <div className="flex flex-row gap-1">
        Xem chi tiết
        <ChevronRightCircle className="w-6 h-6" />
      </div>
    </Link>
  );
}

function ApplicationCardSkeleton() {
  return (
    <div className="p-4 border shadow-sm space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
      <div className="flex flex-row gap-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="w-6 h-6" />
      </div>
    </div>
  );
}
