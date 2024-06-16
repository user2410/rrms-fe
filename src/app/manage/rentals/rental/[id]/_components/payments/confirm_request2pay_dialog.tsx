import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getTotalAmount, Rental, RentalPayment } from "@/models/rental";
import { Session } from "next-auth";
import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { readMoneyVi } from "@/utils/currency";
import { addDays } from "date-fns";
import toast from "react-hot-toast";
import { backendAPI } from "@/libs/axios";

type State = {
  paymentDate: Date;
  payamount: number;
}

export default function ConfirmRequest2PayDialog({
  changePayment,
  payment,
  rental,
  sessionData,
}: {
  changePayment: (data: RentalPayment) => void;
  payment: RentalPayment;
  rental: Rental;
  sessionData: Session;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const total = getTotalAmount(payment, rental);
  const [state, setState] = useState<State>({
    paymentDate: payment.paymentDate || new Date(),
    payamount: payment.payamount || 0,
  } as State);

  async function handleConfirm() {
    // validate input state
    if (state.payamount <= 0) {
      toast.error("Số tiền thanh toán không hợp lệ");
      return;
    }
    try {
      const status = state.payamount < total ? "PARTIALLYPAID" : "PAID";
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/pending`, {
        ...state,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      });
      changePayment({
        ...payment,
        ...state,
        status,
      } as RentalPayment);
      toast.success("Cập nhật thành công");
      closeBtnRef.current?.click();
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Xác nhận</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận thanh toán</DialogTitle>
          <DialogDescription>
            Thanh toán cho khoản thu #{payment.code}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Hạn thanh toán </Label>
            <p className="text-sm">{payment.expiryDate?.toLocaleDateString("vi-VN")} (ân hạn {addDays(payment.expiryDate!, rental.gracePeriod).toLocaleDateString("vi-VN")})</p>
          </div>
          <div className="space-y-2">
            <Label>Số tiền còn phải thanh toán</Label>
            <p className="text-sm">{total.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })} ({readMoneyVi(total)})</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Khai báo</TableHead>
              <TableHead>Thực tế</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Ngày thanh toán</TableCell>
              <TableCell>{payment.paymentDate?.toLocaleDateString("vi-VN")}</TableCell>
              <TableCell>
                <Input
                  type="date"
                  value={state.paymentDate.toISOString().split("T")[0]}
                  min={payment.endDate.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const newPaymentDate = new Date(e.target.value);
                    if (isNaN(newPaymentDate.getTime())) {
                      return;
                    }
                    setState(v => ({
                      ...v,
                      paymentDate: newPaymentDate,
                    }));
                  }}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Số tiền</TableCell>
              <TableCell>{payment.payamount ? `${payment.payamount.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}\n(${readMoneyVi(payment.payamount)})` : "-"}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={state.payamount}
                  onChange={(e) => {
                    setState(v => ({
                      ...v,
                      payamount: e.target.valueAsNumber,
                    }));
                  }}
                />
                <p className="text-sm">{state.payamount.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}&nbsp;{state.payamount > 0 && `(${readMoneyVi(state.payamount)})`}</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <DialogFooter>
          <DialogClose asChild><button ref={closeBtnRef} hidden /></DialogClose>
          <Button type="button" onClick={handleConfirm}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
