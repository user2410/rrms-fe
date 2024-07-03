import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Applications from "./applications";
import Enquiries from "./enquiries";
import { Badge } from "@/components/ui/badge";
import { format, intervalToDuration } from "date-fns";

function durationToString(duration: Duration): string {
  const { days, hours, minutes, seconds } = duration;
  return days ? `${days} ngày ` : hours ? `${hours} giờ ` : minutes ? `${minutes} phút ` : seconds ? `${seconds} giây ` : "";
}

export default function CurrentListing({
  property,
}: {
  property: Property;
}) {
  const session = useSession();
  const router = useRouter();

  const query = useQuery<Listing[]>({
    queryKey: ["manage", "properties", "property", property.id, "listings", "current", session.data!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<Listing[]>(
        `/api/properties/property/${queryKey.at(3)}/listings`,
        {
          params: {
            fields: "title,priority,units,active,created_at,expired_at",
            expired: false,
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
    <div className="w-full grid grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          Tin đăng hiện tại
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Spinner size={24} />
            </div>
          ) : query.isError ? (
            <div className="flex flex-col items-center justify-center">
              <p>Đã xảy ra lỗi khi tải dữ liệu</p>
            </div>
          ) : query.data.length === 0 ? (
            <div className="w-full flex flex-col justify-center items-center gap-3">
              Không có tin đăng nào
              <Button onClick={() => router.push(`/manage/listings/new?propertyId=${property.id}`)}>Tạo tin đăng mới</Button>
            </div>
          ) : query.data.length === 1 ? (
            (() => {
              const l = query.data[0];
              l.createdAt = new Date(l.createdAt);
              l.expiredAt = new Date(l.expiredAt);
              return (
                <div className="w-full flex flex-col gap-3">
                  <div>
                    {l.active ? (
                      <Badge className="bg-green-500 text-white">Đang hoạt động</Badge>
                    ) : (
                      <Badge>Tạm dừng</Badge>
                    )}
                  </div>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-2">
                      <div className="border space-y-1 px-2 py-3">
                        <h2 className="text-center">Bắt đầu đăng</h2>
                        <p className="font-semibold text-center">
                          {durationToString(intervalToDuration({
                            start: l.createdAt,
                            end:  new Date(),
                          }))} trước
                        </p>
                      </div>
                      <div className="border space-y-1 px-2 py-3">
                        <h2 className="text-center">Hết hạn</h2>
                        <p className="font-semibold text-center">
                          {format(l.expiredAt, "hh:mm dd/MM/yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="px-2 py-4">
                      <h2 className="font-semibold text-lg text-center">{l.title}</h2>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push(`/manage/listings/listing/${l.id}`)}
                    className="w-full text-center"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              );
            })()
          ) : (
            <div className="w-full flex flex-col gap-2">
              {query.data.map((l, i) => {
                l.createdAt = new Date(l.createdAt);
                l.expiredAt = new Date(l.expiredAt);
                return (
                  <div key={i} className="border rounded-md px-2 py-1 flex flex-row justify-betweeen">
                    <h3 className="text-ellipsis overflow-hidden">{l.title}</h3>
                    {l.active ? (
                      <Badge className="bg-green-500 text-white">Đang hoạt động</Badge>
                    ) : (
                      <Badge>Tạm dừng</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader>
          Khách thuê quan tâm
        </CardHeader>
        <CardContent>
          <Applications
            listings={query.isSuccess ? query.data : []}
            property={property}
            accessToken={session.data!.user.accessToken}
          />
        </CardContent>
      </Card>
    </div>
  );
};
