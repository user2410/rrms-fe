import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { backendAPI } from "@/libs/axios";
import { Application } from "@/models/application";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import { IoMdMail } from "react-icons/io";

export default function Applications({
  listings,
  property,
  accessToken,
}: {
  listings: Listing[];
  property: Property;
  accessToken: string;
}) {
  const query = useQuery<Application[]>({
    queryKey: ["manage", "properties", "property", property.id, "listings", "current", "appliacations"],
    queryFn: async () => {
      return (await backendAPI.get<Application[]>(`/api/properties/property/${property.id}/applications`, {
        params: {
          fields: "full_name,created_at,status",
          listingIds: listings.map(l => l.id),
          limit: 1000,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })).data || ([]);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 1 * 60 * 1000, // 1 minute
  });

  return (
    <div className="space-y-3 col-span-2">
      <div className="flex flex-row justify-between items-end">
        <h3 className="font-semibold">Đơn ứng tuyển</h3>
        <Link
          href={`/manage/rental/applications?propertyId=${property.id}`}
          className="text-sm hover:underline"
        >
          {query.isSuccess && (
            `Xem tất cả đơn ứng tuyển (${query.data.length})`
          )}
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {
          (query.isLoading || query.isError) ? (
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex flex-row items-center gap-2">
                    <IoMdMail size={24} />
                    Gửi link mời ứng tuyển
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gửi link mời ứng tuyển</DialogTitle>
                    <DialogDescription>Gửi lịnk đến người bạn muốn thuê nhà trọ của mình</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-left">
                        Họ và tên
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-left">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-left">
                        Số điện thoại
                      </Label>
                      <Input
                        id="phone"
                        type="text"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <Button type="submit" className="float-right">Gửi</Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                <div className="font-semibold">+ 7 more applications...</div>
                <h2>John Doe, Lorem Ipsum, ...</h2>
                <div className="flex flex-row gap-1">
                  View
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
    <div className="p-4 border shadow-sm space-y-2">
      <Badge className="uppercase">{"WITHDRAWN"}</Badge>
      <h2>{application.fullName}</h2>
      <div className="flex flex-row gap-1">
        View
        <ChevronRightCircle className="w-6 h-6" />
      </div>
    </div>
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
