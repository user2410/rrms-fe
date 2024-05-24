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
import { Table, TableBody, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { useMemo, useState } from "react";
import { useDataCtx } from "../_context/data.context";
import { Payment } from "@/models/payment";
import { listingPriorities } from "@/models/listing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backendAPI } from "@/libs/axios";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

type STAGE = "extend" | "confirm" | "success" | "error";

export default function Extend({
  disabled,
  refreshPayments,
} : {
  disabled: boolean;
  refreshPayments: () => void;
}) {
  const { listing, sessionData } = useDataCtx();

  const [stage, setStage] = useState<STAGE>("extend");
  const [value, setValue] = useState<number>(30);
  const [res, setRes] = useState<Payment>();
  const sum = useMemo(() => {
    const basePrice = listingPriorities.find(lp => lp.priority === listing.priority)!.basePrice;
    return basePrice * value;
  }, [listing.priority, value]);

  async function handleExtend() {
    try {
      const payment = (await backendAPI.patch(`/api/listings/listing/${listing.id}/extend`, {
        priority: value
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`
        }
      })).data;
      setRes(payment);
      refreshPayments();
      setStage("success");
    } catch(err) {
      console.error(err);
      setStage("error");
    }
  }

  return (
    <Dialog onOpenChange={(_o) => {
      setStage("extend");
      setValue(30);
      setRes(undefined);
    }}>
      <DialogTrigger asChild disabled={disabled}>
        <Button type="button">Gia hạn tin đăng</Button>
      </DialogTrigger>
      <DialogContent>
        {stage === "extend" ? (
          <>
            <DialogHeader>
              <DialogTitle>Gia hạn tin đăng?</DialogTitle>
              <DialogDescription>
                Gia hạn tin đăng để tiếp tục hiển thị tin đăng của bạn.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label>Số ngày mở rộng thêm <span className="text-red-600 ml-2">*</span></Label>
              <Input type="number" min={1} value={value.toString()} onChange={(e) => setValue(e.target.valueAsNumber)}/>
            </div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-left">Gói tin hiện tại</TableCell>
                  <TableCell className="text-right">{(() => {
                    const lp = listingPriorities.find(_lp => _lp.priority === listing.priority);
                    return `${lp?.label} (${lp?.desc})`;
                  })()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-left">Thời gian còn lại</TableCell>
                  <TableCell className="text-right">{((new Date(listing.expiredAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)).toFixed(0)} ngày</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell className="text-left">Tổng</TableCell>
                  <TableCell className="text-right">{sum.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" onClick={() => setStage("confirm")}>Đồng ý</Button>
            </DialogFooter>
          </>
        ) : stage === "confirm" ? (
          <>
            <DialogHeader/>
            <div className="w-full flex flex-row justify-center items-center">
              <h3 className="font-semibold text-xl">Đồng ý nâng cấp gói tin đăng ?</h3>
            </div>
            <DialogFooter className="w-full flex flex-row justify-center">
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit" onClick={handleExtend}>Đồng ý</Button>
            </DialogFooter>
          </>
        ) : stage === "success" ? (
          <>
            <DialogHeader/>
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <FaCheckCircle size={20} color="green" />
              <h2 className="text-center">Đã xác nhận yêu cầu, thanh toán ngay để tiến hành gia hạn tin đăng</h2>
              <Link target="_blank" href={`/manage/payments/payment/${res!.id}`} className="text-blue-600">Thanh toán</Link>
            </div>
          </>
        ) : stage === "error" && (
          <>
            <DialogHeader/>
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <FaBan size={20} color="red" />
              <h2>Đã có lỗi xảy ra</h2>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
