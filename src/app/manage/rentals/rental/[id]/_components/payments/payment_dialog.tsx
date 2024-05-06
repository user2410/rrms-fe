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
import { RentalPayment } from "@/models/rental";
import { readMoneyVi } from "@/utils/currency";
import { differenceInDays, format } from "date-fns";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDataCtx } from "../../_context/data.context";
import { dateDifference } from "@/utils/time";

type State = {
  paymentDate: Date
  requirePenalty: boolean;
  penalty: number;
}

export default function PaymentDialog({
  payment,
  isSideA,
}: {
  payment: RentalPayment;
  isSideA: boolean;
}) {
  const { sessionData, changePayment } = useDataCtx();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [state, setState] = useState<State>({
    paymentDate: new Date(),
    requirePenalty: false,
    penalty: 0,
  } as State);

  async function handlePayment() {
    try {
      const status = isSideA ? "PAID" : "REQUEST2PAY";
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/pending`, {
        ...state,
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
        penalty: state.penalty,
      } as RentalPayment);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button>{isSideA ? "Xác nhận" : "Thanh toán"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isSideA ? "Xác nhận thanh toán" : "Thanh toán"}</DialogTitle>
          <DialogDescription>
            Thanh toán cho khoản thu #{payment.code}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {isSideA && (
            <div className="space-y-2">
              <Label>Ngày thanh toán khai báo</Label>
              <p className="text-sm">{payment.paymentDate?.toLocaleDateString("vi-VN")}</p>
            </div>
          )}
          <div className="space-y-2">
            <Label>Hạn thanh toán </Label>
            <p className="text-sm">{payment.expiryDate?.toLocaleDateString("vi-VN")}</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Ngày thanh toán {isSideA && "thực tế"} <span className="text-red-600">*</span></Label>
          <Input
            type="date"
            value={format(state.paymentDate, "yyyy-MM-dd")}
            onChange={(e) => setState(v => ({
              ...v,
              paymentDate: new Date(e.target.value),
            }))}
          />
          {state.paymentDate > payment.expiryDate && (
            <p className="text-xs font-light text-red-600">Muộn {dateDifference(state.paymentDate, payment.expiryDate)}</p>
          )}
        </div>
        {state.paymentDate > payment.expiryDate && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="penalty" 
                checked={state.requirePenalty}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    setState(v => ({
                      ...v,
                      penalty: 0,
                    }));
                  }
                  setState(v => ({
                    ...v,
                    requirePenalty: !!checked,
                  }));
                }}
                />
              <label
                htmlFor="penalty"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Yêu cầu nộp tiền phạt
              </label>
            </div>
            {state.requirePenalty && (
              <div className="space-y-2">
                <Input
                  type="number"
                  min={0}
                  value={state.penalty}
                  onChange={(e) => setState(v => ({
                    ...v,
                    penalty: e.target.valueAsNumber,
                  }))}
                />
                <p className="text-xs font-light">
                  {state.penalty ? `${state.penalty.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}` : ""} {state.penalty ? `(${readMoneyVi(state.penalty)})` : ""}
                </p>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild><button ref={closeBtnRef} hidden /></DialogClose>
          <Button type="button" onClick={handlePayment}>{isSideA ? "Xác nhận" : "Thanh toán"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
