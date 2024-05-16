import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { backendAPI } from "@/libs/axios";
import { getListingState, listingPriorities } from "@/models/listing";
import { Payment } from "@/models/payment";
import { useQuery } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useDataCtx } from "../_context/data.context";
import Extend from "./extend";
import Upgrade from "./upgrade";
import Link from "next/link";


type FormValues = {
  priority: number;
};

export default function Billings() {
  const { listing, sessionData } = useDataCtx();
  const listingState = getListingState(listing);
  const timeLeft = ((new Date(listing.expiredAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000));

  const query = useQuery<Payment[]>({
    queryKey: ["manage", "listings", "listing", "payments", listing.id],
    queryFn: async () => {
      return (await backendAPI.get<Payment[]>(`/api/listings/listing/${listing.id}/payments`, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        },
      })).data || ([]);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <>
      <div className="space-y-1">
        {(timeLeft > 0 && timeLeft < 1) && (
          <Alert>
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Sắp hết hạn tin đăng</AlertTitle>
            <AlertDescription>
              Gia hạn tin đăng để tiếp tục hiển thị tin đăng của bạn.
            </AlertDescription>
          </Alert>
        )}
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Gói đăng tin</h3>
            <div className="grid grid-cols-4 gap-3">
              {listingPriorities.map((item, index) => (
                <div className={`rounded-md border-2 p-4 flex flex-col items-center gap-2 ${item.priority === listing.priority ? "border-foreground" : "border-muted"}`} key={index}>
                  <h3 className="text-foreground font-medium">{item.label}</h3>
                  <p className="text-muted-foreground text-sm text-center">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Ngày đăng</h4>
                <p>{new Date(listing.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Ngày hết hạn</h4>
                <div className="inline-block">
                  {new Date(listing.expiredAt).toLocaleDateString("vi-VN")} &nbsp;
                  ({timeLeft < 0 ? (
                    <span className="text-red-600">(Đã hết hạn)</span>
                  ) : (
                    `${timeLeft.toFixed(0)} ngày`
                  )})
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Cập nhật lần cuối </h4>
                <p>{new Date(listing.updatedAt).toLocaleDateString("vi-VN")} {new Date(listing.updatedAt).toLocaleTimeString("vi-VN")}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Gia hạn gói đăng tin</h3>
            <Extend
              refreshPayments={query.refetch}
              disabled={
                listingState === "expired" ||
                (query.isSuccess && !!query.data.find((item) => (
                  item.orderInfo.slice(1).startsWith("EXTENDLISTING")
                  && item.status !== "SUCCESS"
                )))
              }
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Nâng cấp gói đăng tin</h3>
            <Upgrade
              refreshPayments={query.refetch}
              disabled={
                listingState === "expired" ||
                listing.priority === listingPriorities[listingPriorities.length - 1].priority ||
                (query.isSuccess && !!query.data.find((item) => (
                  item.orderInfo.slice(1).startsWith("UPGRADELISTING")
                  && item.status !== "SUCCESS"
                )))
              }
            />
          </div>
          <Table>
            <TableCaption>Danh sách các hóa đơn.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Mã hóa đơn</TableHead>
                <TableHead>Thông tin</TableHead>
                <TableHead>Thành tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Đang tải...</TableCell>
                </TableRow>
              ) : query.isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">Đã có lỗi xảy ra</TableCell>
                </TableRow>
              ) : (query.data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.orderId}</TableCell>
                  <TableCell>
                    <Link
                      target="_blank"
                      href={`/manage/payment/${item.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      {item.orderInfo.slice(item.orderInfo.indexOf(']') + 1)}
                    </Link>
                  </TableCell>
                  <TableCell>{item.amount.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}</TableCell>
                  <TableCell>{
                    item.status === "PENDING"
                      ? "Đang chờ thanh toán"
                      : item.status === "SUCCESS"
                      && "Thanh toán thành công"
                  }</TableCell>
                </TableRow>
              )))}
            </TableBody>
            <TableFooter className="flex flex-row justify-end">

            </TableFooter>
          </Table>

        </CardContent>
      </Card>
    </>

  );
};
