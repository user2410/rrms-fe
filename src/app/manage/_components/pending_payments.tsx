import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { backendAPI } from "@/libs/axios";
import { getRentalPaymentReasonText } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Link from "next/link";
import { RentalPaymentItem } from "./rent-payment-tile";
import { IconBadge } from "@/components/ui/icon-badge";
import { TrendingUp } from "lucide-react";


type PendingPaymentData = {
  total: number;
  payments: RentalPaymentItem[];
};

export default function PendingPayments({
  className,
  sessionData
}: {
  className?: string;
  sessionData: Session;
}) {
  const query = useQuery<PendingPaymentData>({
    queryKey: ["manage", "statistic", "pending-payments", sessionData!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get("/api/statistics/tenant/arrears", {
        params: {
          limit: 5,
          offset: 0,
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        }
      })).data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <IconBadge icon={TrendingUp} variant="warning"/>
          <CardTitle className="text-lg">Các khoản chưa thanh toán</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <div className="flex items-center justify-center">
            <Spinner size={32} />
          </div>
        ) : query.isError ? (
          <div className="flex items-center justify-center">
            Lỗi khi tải dữ liệu
          </div>
        ) : (
          <div>
            <span>
              <strong>Tổng:</strong> {query.data.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </span>
            <Table>
              <TableCaption>Khoản thu chưa trả gần đây.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Dịch vụ</TableHead>
                  <TableHead>Số tiền</TableHead>
                  <TableHead/>
                </TableRow>
              </TableHeader>
              <TableBody>
                {query.data.payments.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{getRentalPaymentReasonText(item, item.services)}</TableCell>
                      <TableCell>{item.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                      <TableCell>
                        <Link 
                          href={`/manage/rentals/rental/${item.rentalId}`}
                          className="underline text-blue-600"
                        >
                          Chi tiết
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>

            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

