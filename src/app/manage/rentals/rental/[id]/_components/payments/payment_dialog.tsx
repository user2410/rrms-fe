import { Button } from "@/components/ui/button";
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
import { RentalPayment } from "@/models/rental";
import { format } from "date-fns";
import { useRef, useState } from "react";
import { useDataCtx } from "../../_context/data.context";
import toast from "react-hot-toast";

export default function PaymentDialog({
  payment,
  isSideA,
} : {
  payment: RentalPayment;
  isSideA: boolean;
}) {
  const {sessionData, changePayment} = useDataCtx();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());

  async function handlePayment() {
    try {
      const status = isSideA ? "PAID" : "REQUEST2PAY";
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/pending`, {
        paymentDate,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      });
      toast.success("Cập nhật thành công");
      closeBtnRef.current?.click();
      changePayment({
        ...payment,
        status,
      } as RentalPayment);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>{isSideA ? "Xác nhận" :"Thanh toán"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSideA ? "Xác nhận thanh toán" : "Thanh toán"}</DialogTitle>
          <DialogDescription>
            Thanh toán cho khoản thu #{payment.code}
          </DialogDescription>
        </DialogHeader>
        {isSideA && (
          <div className="space-y-2">
            <Label>Ngày thanh toán khai báo</Label>
            <p className="text-sm">{payment.paymentDate?.toLocaleDateString("vi-VN")}</p>
          </div>
        )}
        <div className="space-y-2">
          <Label>Ngày thanh toán {isSideA && "thực tế"} <span className="text-red-600">*</span></Label>
          <Input
            type="date"
            value={format(paymentDate, "yyyy-MM-dd")}
            onChange={(e) => setPaymentDate(new Date(e.target.value))}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild><button ref={closeBtnRef} hidden /></DialogClose>
          <Button type="button" onClick={handlePayment}>{isSideA ? "Xác nhận" : "Thanh toán"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
