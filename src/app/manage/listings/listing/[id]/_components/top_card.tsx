import { PropertyTypeBadge } from "@/components/complex/property";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { getListingState } from "@/models/listing";
import { getUserFullName, User } from "@/models/user";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useDataCtx } from "../_context/data.context";

export default function TopCard() {
  const { listing, property, sessionData } = useDataCtx();

  const query = useQuery<User>({
    queryKey: ["manage", "listings", "listing", "user", listing.creatorId],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<User[]>("/api/auth/credential/ids", {
        params: {
          ids: queryKey.at(4),
        },
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        }
      })).data;
      return res[0];
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  const state = getListingState(listing);

  return (
    <>
      {(!listing.active && Date.now() > new Date(listing.expiredAt).getTime()) && (
        <Alert>
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Tin đăng chưa được kích hoạt</AlertTitle>
          <AlertDescription>
            Tin đăng của bạn chưa được kích hoạt, vui lòng&nbsp;
            <Link href="">thanh toán</Link>&nbsp;
            để kích hoạt tin đăng.
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{listing.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Mã tin đăng</h3>
            <Link
              href={`/listings/${listing.id}`}
              target="_blank"
              className="flex flex-row items-start gap-2 text-sm"
            >
              {listing.id}
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Người đăng tin</h3>
            <span className="text-base">
              {listing.fullName}&nbsp;
              {query.isLoading ? (<Spinner size={4} />) : query.isSuccess ? (`(${getUserFullName(query.data)})`) : null}
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Trạng thái</h3>
            <div className="flex flex-row items-center gap-2">
              <span className={`w-4 h-4 rounded-full ${state === "active" ? "bg-green-600" : "bg-slate-600"}`} />
              <p className="uppercase text-sm">{state === "active" ? "Online" : state === "expired" ? "Hết hạn" : "Chưa thanh toán"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Nhà cho thuê</h3>
            <span className="space-x-2">
              <PropertyTypeBadge property={property} />
              <Link
                href={`/manage/properties/property/${listing.propertyId}`}
                className="hover:underline"
              >
                {property.name}
              </Link>
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Ngày đăng tin</h3>
            <p>{new Date(listing.createdAt).toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Ngày hết hạn</h3>
            <p>{new Date(listing.expiredAt).toLocaleDateString("vi-VN")}</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
