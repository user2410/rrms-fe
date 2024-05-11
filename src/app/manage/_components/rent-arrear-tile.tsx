import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { RentalPayment } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Link from "next/link";
import { useMemo } from "react";
import ArrearItem from "./arrear_item";

export type RentalPaymentItem = RentalPayment & {
  expiryDuration: number;
  tenantId: string;
  tenantName: string;
  propertyId: string;
  unitId: string;
};

type RentalPaymentArrearsItem = {
  startTime: Date;
  endTime: Date;
  payments: RentalPaymentItem[];
};

type Data = RentalPaymentArrearsItem[];

export default function RentArrearTile({
  sessionData
}: {
  sessionData: Session;
}) {
  const arrearsQuery = useQuery<Data>({
    queryKey: ["manage", "statistic", "arrears"],
    queryFn: async () => {
      const startTime = new Date(sessionData.user.user.createdAt);
      const res = (await backendAPI.get<Data>("/api/statistics/rentals/payments/arrears", {
        params: {
          startTime,
          endTime: new Date(),
          limit: 5,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data || ([]);
      return res.map((item) => ({
        ...item,
        startTime: new Date(item.startTime),
        endTime: new Date(item.endTime),
        payments: item.payments.map((payment) => ({
          ...payment,
          startDate: new Date(payment.startDate),
          endDate: new Date(payment.endDate),
          expiryDate: payment.expiryDate ? new Date(payment.expiryDate) : undefined,
          paymentDate: payment.paymentDate ? new Date(payment.paymentDate) : undefined,
          createdAt: new Date(payment.createdAt),
          updatedAt: new Date(payment.updatedAt),
        })),
      }));
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const lastMonthArrears = useMemo(() => {
    if (arrearsQuery.status === 'success') {
      return arrearsQuery.data[arrearsQuery.data.length - 1].payments;
    }
    return [];
  }, [arrearsQuery.status]);
  const allTimeArrears = useMemo(() => {
    if (arrearsQuery.status === 'success') {
      return arrearsQuery.data.reverse().map(item => item.payments).flat();
    }
    return [];
  }, [arrearsQuery.status]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row items-center justify-between">
            Nợ tiền thuê
            <Link href="#" className="text-primary text-base font-semibold">Xem tất cả</Link>
          </div>
        </CardTitle>
        <CardDescription>
          Nợ tháng này: {lastMonthArrears.reduce((acc, item) => acc + item.amount, 0).toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })} / Tổng nợ: {allTimeArrears.reduce((acc, item) => acc + item.amount, 0).toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}
        </CardDescription>
      </CardHeader>
      {arrearsQuery.isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner size={32} />
        </div>
      ) : arrearsQuery.isError ? (
        <div className="flex items-center justify-center">
          Lỗi khi tải dữ liệu
        </div>
      ) : (
        <CardContent>
          {/* <span className="text-2xl font-bold">{lastMonthArrears.reduce((acc, item) => acc + getTotalAmount(item), 0).toLocaleString()}</span>
          <span className="text-xl font-light">/ {allTimeArrears.reduce((acc, item) => acc + item.amount, 0).toLocaleString()}</span> */}
          <div className="space-y-3">
            {allTimeArrears.slice(0, 5).map((item, index) => (
              <ArrearItem key={index} item={item} sessionData={sessionData}/>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

