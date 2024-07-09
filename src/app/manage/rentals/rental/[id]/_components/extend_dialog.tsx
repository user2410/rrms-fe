import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { backendAPI } from "@/libs/axios";
import { Rental, RentalRequest } from "@/models/rental";
import { addMonths } from "date-fns";
import { Session } from "next-auth";
import { useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

type FormValues = {
  note: string;
  extendDuration: number;
};

export default function ExtendDialog({
  rental,
  requests,
  sessionData,
  onSubmit,
}: {
  rental: Rental;
  requests: RentalRequest[];
  sessionData: Session;
  onSubmit: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState<FormValues>({
    note: "",
    extendDuration: 12,
  });
  const extendRequests = useMemo<RentalRequest[]>(() => {
    return requests.filter(req => req.type === "EXTEND").sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault();
    try {
      await backendAPI.post(`/api/rentals/rental/${rental.id}/requests/extend`, value, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        }
      });
      closeBtnRef.current?.click();
      setValue({ note: "", extendDuration: 12 });
      onSubmit();
      toast.success("Đã gửi yêu cầu gia hạn hợp đồng.");
    } catch(err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu gia hạn hợp đồng.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" disabled={extendRequests.length > 0 && extendRequests[0].status === "PENDING"}>
          {(extendRequests.length > 0 && extendRequests[0].status === "PENDING") ? "Đã gửi yêu cầu" : "Đề nghị gia hạn"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đề nghị gia hạn hợp đồng thuê nhà</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Thời gian gia hạn thêm (tháng) <span className="ml-2 text-red-600">*</span></Label>
            <Input
              type="number"
              min={1}
              value={value.extendDuration}
              onChange={(e) => setValue({ ...value, extendDuration: e.target.valueAsNumber })}
            />
            <p className="text-sm text-muted-foreground">Thời hạn thuê mới: {addMonths(new Date(rental.startDate), rental.rentalPeriod + value.extendDuration).toLocaleDateString("vi-VN")}</p>
          </div>
          <div className="space-y-2">
            <Label>Lý do đề nghị gia hạn thêm</Label>
            <Textarea
              value={value.note}
              placeholder={rental.tenantId === sessionData.user.user.id ? "Sau thời gian thuê nhà, tôi muốn / có nhu cầu thuê thêm một thời gian nữa." : "Tôi muốn bạn tiếp tục thuê thêm một thời gian nữa."}
              onChange={(e) => setValue({ ...value, note: e.target.value })}
            />
          </div>
          <div className="flex flex-row justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" ref={closeBtnRef}>Hủy</Button>
            </DialogClose>
            <Button type="submit">Gửi lời đề nghị</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  );
};
