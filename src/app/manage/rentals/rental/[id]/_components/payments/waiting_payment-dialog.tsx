import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backendAPI } from "@/libs/axios";
import { cn } from "@/libs/utils";
import { getTotalAmount, Rental, RentalPayment } from "@/models/rental";
import { readMoneyVi } from "@/utils/currency";
import { dateDifference } from "@/utils/time";
import { addDays } from "date-fns";
import { Session } from "next-auth";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type State = {
  paymentDate: Date
  payamount: number;
};

// update PENDING and PARTIALLYPAID status
export default function WaitingPaymentDialog({
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
    paymentDate: new Date(),
    payamount: 0,
  } as State);

  async function handlePayment() {
    // validate input state
    if (state.payamount <= 0) {
      toast.error("Số tiền thanh toán không hợp lệ");
      return;
    }
    try {
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/${payment.status.toLowerCase()}`, {
        ...state,
        status: "REQUEST2PAY",
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      }
      );
      toast.success("Cập nhật thành công");
      closeBtnRef.current?.click();
      changePayment({
        ...payment,
        status: 'REQUEST2PAY',
        payamount: state.payamount,
        paymentDate: state.paymentDate,
      } as RentalPayment);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Thanh toán</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán</DialogTitle>
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
          <div className="space-y-2">
            <Label>Ngày thanh toán thực tế <span className="text-red-600">*</span></Label>
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
            {state.paymentDate > payment.expiryDate! && (
              <p className="text-xs font-light text-red-600">Muộn {dateDifference(state.paymentDate, payment.expiryDate!)}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Số tiền thanh toán thực tế <span className="text-red-600">*</span></Label>
            <Input
              type="number"
              value={state.payamount}
              max={total}
              onChange={(e) => {
                setState(v => ({
                  ...v,
                  payamount: e.target.valueAsNumber,
                }));
              }}
            />
            {state.payamount > 0 && (
              <p className="text-sm">{state.payamount.toLocaleString("vi-VN", {style: "currency", currency: "VND"})} ({readMoneyVi(state.payamount)})</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><button ref={closeBtnRef} hidden /></DialogClose>
          <Button type="button" onClick={handlePayment}>Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
