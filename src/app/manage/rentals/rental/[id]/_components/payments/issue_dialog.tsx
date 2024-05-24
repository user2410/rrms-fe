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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { backendAPI } from "@/libs/axios";
import { getRentalPaymentReasonText, Rental, RentalPayment } from "@/models/rental";
import { readMoneyVi } from "@/utils/currency";
import { Session } from "next-auth";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function IssueDialog({
  changePayment,
  payment,
  sessionData,
  rental,
} : {
  changePayment: (data: RentalPayment) => void;
  payment: RentalPayment;
  sessionData: Session;
  rental: Rental;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const total = payment.amount - (payment.discount || 0);
  const [note, setNote] = useState<string>("");

  async function handleRequest() {
    try {
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/issued`, {
        status: "PLAN",
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      });
      changePayment({
        ...payment,
        status: "PLAN",
      } as RentalPayment);
      toast.success("Cập nhật thành công");
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }
  
  async function handleAccept() {
    try {
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/issued`, {
        note,
        status: "PENDING",
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      });
      changePayment({
        ...payment,
        status: "PENDING",
      } as RentalPayment);
      toast.success("Cập nhật thành công");
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Chi tiết khoản thu</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Chi tiết khoản thu</DialogTitle>
          <DialogDescription>
            Hạn nộp: {payment.expiryDate?.toLocaleDateString("vi-VN")}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-6 gap-3">
          <div className="col-span-3 space-y-2">
            <Label>Mã hóa đơn</Label>
            <p className="text-sm">{payment.code}</p>
          </div>
          <div className="col-span-3 space-y-2">
            <Label>Dịch vụ</Label>
            <p className="text-sm">{getRentalPaymentReasonText(payment, rental.services)}</p>
          </div>
          <div className="col-span-3 space-y-2">
            <Label>Từ ngày</Label>
            <p className="text-sm">{payment.startDate.toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="col-span-3 space-y-2">
            <Label>Đến ngày</Label>
            <p className="text-sm">{payment.endDate.toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Số tiền</Label>
            <p className="text-sm">{`${payment.amount.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}`}</p>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Khấu trừ</Label>
            <p className="text-sm">{payment.discount ? `${payment.discount.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })} (${readMoneyVi(payment.discount)})` : " - "}</p>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Tổng số tiền</Label>
            <p className="text-sm">{total.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })} ({readMoneyVi(total)})</p>
          </div>
          <div className="col-span-6 space-y-2">
            <Label>Kiến nghị gửi bên cho thuê</Label>
            <Textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><button ref={closeBtnRef} type="button" hidden/></DialogClose>
          <Button type="button" variant="outline" onClick={handleRequest}>Gửi phản hồi</Button>
          <Button type="button" onClick={handleAccept}>Chấp nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
