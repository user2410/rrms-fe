import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { RentalPayment } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { useDataCtx } from "../_context/data.context";
import CreatePaymentDialog from "./payments/create_payment_dialog";
import { PaymentTableHistory, PaymentTablePlan, PaymentTableWaitingForConfirmation, PaymentTableWaitingForPayment } from "./payments/payment_table";
import PaymentinfoCard from "./payments/paymentinfo_card";

export default function PaymentsWrapper() {
  const { rental, sessionData } = useDataCtx();

  const query = useQuery<RentalPayment[]>({
    queryKey: ["manage", "rentals", "rental", rental.id, "payments", sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<RentalPayment[]>(`/api/rental-payments/rental/${queryKey.at(3)}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
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
        <Spinner />
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="text-red-500">Lỗi khi tải dữ liệu</div>
    );
  }

  return (
    <Payments _payments={query.data} refetch={query.refetch} />
  );
};

function Payments({
  _payments,
  refetch,
}: {
  _payments: RentalPayment[];
  refetch: () => void;
}) {
  const { payments, setPayments, isSideA, sessionData } = useDataCtx();

  useEffect(() => {
    setPayments(_payments);
  }, [_payments]);

  return (
    <div className="space-y-4">
      <div className="">
        <PaymentinfoCard/>
      </div>
      <Card className=" space-y-3">
        <CardHeader className="pt-6 pb-3 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Khoản thu</CardTitle>
          <div className="flex flex-row items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" onClick={refetch}>Tạo</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo khoản thu</DialogTitle>
                </DialogHeader>
                <CreatePaymentDialog/>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={refetch}><RefreshCcw className="w-6 h-6" /></Button>
          </div>
        </CardHeader>
        <PaymentTableWaitingForPayment
          payments={payments.filter(p => ['PENDING', 'PARTIALLYPAID'].includes(p.status))}
        />
        <Separator />
        {isSideA(sessionData.user.user.id) && (
          <>
            <PaymentTablePlan
              payments={payments.filter(p => p.status === 'PLAN')}
            />
            <Separator />
          </>
        )}
        <PaymentTableWaitingForConfirmation
          payments={payments.filter(p => ['ISSUED', 'REQUEST2PAY', 'PAYFINE'].includes(p.status))}
        />
        <Separator />
        <PaymentTableHistory
          payments={payments.filter(p => ['PAID', 'CANCELLED'].includes(p.status))}
        />
      </Card>
    </div>
  );
}
