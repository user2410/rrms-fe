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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableFooter, TableRow } from "@/components/ui/table";
import { backendAPI } from "@/libs/axios";
import { getListingState, listingPriorities } from "@/models/listing";
import { Payment } from "@/models/payment";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FaBan, FaCheckCircle } from "react-icons/fa";
import { useDataCtx } from "../_context/data.context";

type STAGE = "upgrade" | "confirm" | "success" | "error";

export default function Upgrade({
  refreshPayments,
  disabled,
} : {
  refreshPayments: () => void;
  disabled: boolean;
}) {
  const { listing, sessionData } = useDataCtx();
  const lps = listingPriorities.filter(lp => lp.priority > listing.priority);

  const [stage, setStage] = useState<STAGE>("upgrade");
  const [value, setValue] = useState<number>(lps[0]?.priority ?? 4);
  const [res, setRes] = useState<Payment>();

  const timeLeft = useMemo<number>(() => {
    return (new Date(listing.expiredAt).getTime() - Date.now());
  }, [listing.expiredAt]);
  const sum = useMemo(() => {
    const daysLeft = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
    const newBasePrice = listingPriorities.find(lp => lp.priority === value)!.basePrice;
    const oldBasePrice = listingPriorities.find(lp => lp.priority === listing.priority)!.basePrice;
    return daysLeft * (newBasePrice - oldBasePrice);
  }, [listing.priority, value, timeLeft]);

  async function handleUpgrade() {
    try {
      const payment = (await backendAPI.patch(`/api/listings/listing/${listing.id}/upgrade`, {
        priority: value
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`
        }
      })).data;
      setRes(payment);
      setStage("success");
      refreshPayments();
    } catch(err) {
      console.error(err);
      setStage("error");
    }
  }
  return (
    <Dialog onOpenChange={(_o) => {
      setStage("upgrade");
      setValue(lps[0]?.priority ?? 0);
      setRes(undefined);
    }}>
      <DialogTrigger
        asChild
        disabled={disabled}
      >
        <Button type="button">Nâng cấp</Button>
      </DialogTrigger>

      <DialogContent>
        {stage === "upgrade" ? (
          <>
            <DialogHeader>
              <DialogTitle>Nâng cấp gói tin đăng</DialogTitle>
              <DialogDescription>
                Nâng cấp để hiển thị tin đăng của bạn ở vị trí cao hơn.
              </DialogDescription>
            </DialogHeader>
            <RadioGroup
              onValueChange={(e) => setValue(parseInt(e))}
              defaultValue={value.toString()}
              className={`w-full grid grid-cols-${lps.length} gap-8 pt-2`}
            >
              {lps.map((item, index) => (
                <div key={index} className="space-y-2">
                  <Label className="[&:has([data-state=checked])>div]:border-primary">
                    <RadioGroupItem value={item.priority.toString()} className="sr-only" />
                    <div className="rounded-md border-2 border-muted p-4 hover:border-accent flex flex-col items-center gap-2">
                      <h3 className="text-foreground font-medium">{item.label}</h3>
                      <p className="text-muted-foreground text-sm text-center">{item.desc}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
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
              <Button type="submit" onClick={handleUpgrade}>Đồng ý</Button>
            </DialogFooter>
          </>
        ) : stage === "success" ? (
          <>
            <DialogHeader/>
            <div className="w-full flex flex-col items-center justify-center gap-2">
              <FaCheckCircle size={20} color="green" />
              <h2 className="text-center">Đã xác nhận yêu cầu, thanh toán ngay để tiến hành nâng cấp tin đăng</h2>
              <Link target="_blank" href={`/manage/payment/${res!.id}`}>Thanh toán</Link>
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
    </Dialog >
  );
};
