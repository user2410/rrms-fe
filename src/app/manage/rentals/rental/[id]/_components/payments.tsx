import { isOverdue, RentalPayment } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { useDataCtx } from "../_context/data.context";
import { backendAPI } from "@/libs/axios";
import PaymentsTable from "./payments/payment_table";
import Spinner from "@/components/ui/spinner";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function PaymentsWrapper() {
  const { rental, sessionData } = useDataCtx();

  const query = useQuery<RentalPayment[]>({
    queryKey: ["manage", "rentals", "rental", rental.id, "payments"],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<RentalPayment[]>(`/api/rental-payments/rental/${queryKey.at(3)}`, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        },
      })).data || [];

      return res.map(rp => ({
        ...rp,
        startDate: new Date(rp.startDate),
        endDate: new Date(rp.endDate),
        createdAt: new Date(rp.createdAt),
        updatedAt: new Date(rp.updatedAt),
        paymentDate: rp.paymentDate ? new Date(rp.paymentDate) : null,
        expiryDate: rp.expiryDate ? new Date(rp.expiryDate) : null,
      } as RentalPayment));
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  if (query.isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        Loading ...
        <Spinner/>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="text-red-500">Lỗi khi tải dữ liệu</div>
    );
  }

  return (
    <Payments _payments={query.data} refetch={query.refetch}/>
  );
};

function Payments({
  _payments,
  refetch,
} : {
  _payments: RentalPayment[];
  refetch: () => void;
}) {
  const {payments, setPayments, isSideA, sessionData} = useDataCtx();

  useEffect(() => {
    setPayments(_payments);
  }, [_payments]);

  return (
    <div className="space-y-4">
      <Card className="space-y-3">
        <CardHeader className="pt-6 pb-3 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Khoản thu</CardTitle>
          <Button variant="outline" onClick={refetch}><RefreshCcw className="w-6 h-6"/></Button>
        </CardHeader>
        <PaymentsTable 
          payments={payments.
            filter(p => p.status === 'PENDING').
            map(p => ({...p, overdue: isOverdue(p)})).
            // sort by overdue first, then by start date
            sort((a, b) => {
              if (a.overdue && !b.overdue) return -1;
              if (!a.overdue && b.overdue) return 1;
              return a.startDate.getTime() - b.startDate.getTime();
            })
          }
          status="PENDING"
        />
        <Separator/>
        {isSideA(sessionData.user.user.id) && (
          <>
            <PaymentsTable 
              payments={payments.filter(p => p.status === 'PLAN')}
              status="PLAN"
            />
            <Separator/>
          </>
        )}
        <PaymentsTable 
          payments={payments.filter(p => ['ISSUED', 'REQUEST2PAY'].includes(p.status))}
          status="ISSUED"
        />
        <Separator/>
        <PaymentsTable 
          payments={payments.filter(p => ['PAID', 'CANCELLED'].includes(p.status))}
          status="PAID"
        />
      </Card>
      <Card className="">
        <CardHeader className="pt-6 pb-3 px-6">
          <CardTitle>Chi phí</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
