import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { getRentalPaymentReasonText, getTotalAmount, Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Link from "next/link";
import { RentalPaymentItem } from "./rent-payment-tile";
import { Label } from "@/components/ui/label";
import { readMoneyVi } from "@/utils/currency";
import { useMemo } from "react";
import { cn } from "@/libs/utils";
import { Button, buttonVariants } from "@/components/ui/button";

type Data = {
  rental: Rental;
  property: Property;
  unit: Unit;
};

export default function ArrearItem({
  item,
  sessionData,
}: {
  item: RentalPaymentItem;
  sessionData: Session;
}) {
  const query = useQuery<Data>({
    queryKey: ["manage", "arrears", "rental", item.id, item.rentalId, sessionData!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const rental = (await backendAPI.get<Rental>(`/api/rentals/rental/${queryKey.at(4)}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      const property = (await backendAPI.get<Property>(`/api/properties/property/${rental.propertyId}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      const unit = (await backendAPI.get<Unit>(`/api/units/unit/${rental.unitId}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      return { rental, property, unit } as Data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });

  const total = useMemo(() => {
    if (query.data) {
      return getTotalAmount(item, query.data?.rental);
    }
    return 0;
  }, [item, query.data]);

  return (
    <Dialog>
      <DialogTrigger>
        <Card className={cn("p-2", item.expiryDuration < 0 && "bg-purple-200")}>
          <div className="grid grid-cols-7 gap-2">
            <div className="col-span-4 flex flex-row items-center gap-1.5">
              <Avatar>
                <AvatarFallback>{item.tenantName.split(" ").slice(-2).map(i => i[0]).join("")}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <p className="text-sm font-semibold truncate text-ellipsis text-left">{item.tenantName}</p>
                <span className="font-light max-w-[32px]">
                  {query.isSuccess && (<p className="text-xs truncate text-ellipsis">{`${query.data.property.name} Phòng ${query.data.unit.name}`}</p>)}
                </span>
              </div>
            </div>
            <div className="col-span-2 flex flex-col justify-center">
              <p className="text-sm">{query.isSuccess && getRentalPaymentReasonText(item, query.data.rental.services)}</p>
            </div>
            <div className="col-span-1 flex flex-col justify-center">
              {query.isSuccess && (
                <p className="text-sm">{getTotalAmount(item, query.data.rental).toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}</p>
              )}
            </div>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Khoản thu còn nợ</DialogTitle>
          <DialogDescription>

          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-6 gap-2">
          <div className="space-y-2 col-span-3">
            <Label>Mã hóa đơn</Label>
            <p className="text-sm">{item.code}</p>
          </div>
          <div className="space-y-2 col-span-3">
            <Label>Dịch vụ</Label>
            <p className="text-sm">{getRentalPaymentReasonText(item, item.services)}</p>
          </div>
          <div className="space-y-2 col-span-3">
            <Label>Từ ngày</Label>
            <p className="text-sm">{item.startDate.toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="space-y-2 col-span-3">
            <Label>Đến ngày</Label>
            <p className="text-sm">{item.endDate.toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="space-y-2 col-span-3">
            <Label>Số tiền</Label>
            <p className="text-sm">{item.endDate.toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="space-y-2 col-span-3">
            <Label>Khấu trừ</Label>
            <p className="text-sm">{item.discount ? `${item.discount.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })} (${readMoneyVi(item.discount)})` : " - "}</p>
          </div>
          <div className={cn("space-y-2", item.status === "PAYFINE" ? "col-span-2" : "col-span-3")}>
            <Label>Đã thanh toán</Label>
            <p className="text-sm">{item.paid?.toLocaleString("vi-VN", {style: 'currency', currency: 'VND'}) || "0 VND"}</p>
          </div>
          {item.status === "PAYFINE" && (
            <div className="space-y-2 col-span-2">
              <Label>Tiền phạt</Label>
              <p className="text-sm">{item.fine?.toLocaleString("vi-VN", {style: 'currency', currency: 'VND'}) || "0 VND"}</p>
            </div>
          )}
          <div className={cn("space-y-2", item.status === "PAYFINE" ? "col-span-2" : "col-span-3")}>
            <Label>Phải nộp</Label>
            <p className="text-sm">
              {`${total.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}`}
              <br/>
              {readMoneyVi(total)}
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-row items-center justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Đóng</Button>
          </DialogClose>
          <Link href={`/manage/rentals/rental/${item.rentalId}`} className={buttonVariants({variant: 'default'})}>
            Profile thuê nhà
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
