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
import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { addDays } from "date-fns";
import { readMoneyVi } from "@/utils/currency";
import toast from "react-hot-toast";
import { backendAPI } from "@/libs/axios";

type State = {
  paymentDate: Date;
}

export default function ConfirmFinePaymentDialog({
  changePayment,
  payment,
  rental,
  sessionData,
} : {
  changePayment: (data: RentalPayment) => void;
  payment: RentalPayment;
  rental: Rental;
  sessionData: Session;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const total = getTotalAmount(payment, rental);

  async function handleConfirm() {
    try {
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/payfine`, undefined, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      });
      toast.success("Cập nhật thành công");
      changePayment({
        ...payment,
        payamount: total,
        paid: total,
        status: "PAID",
      } as RentalPayment);
      closeBtnRef.current?.click();
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi xác nhận thanh toán");
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
            <Label>Số tiền phạt</Label>
            <p className="text-sm">{payment.fine && `${payment.fine.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })} (${readMoneyVi(payment.fine)})`}</p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><button ref={closeBtnRef} hidden /></DialogClose>
          <Button type="button" onClick={handleConfirm}>Xác nhận đã thanh toán tiền phạt</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
