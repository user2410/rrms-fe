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
import { backendAPI } from "@/libs/axios";
import { Rental, RentalRequest } from "@/models/rental";
import { Session } from "next-auth";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type FormValues = {
  note: string;
  rentalPayments: number[];
  rentalComplaints: number[];
};

export default function CancelDialog({
  rental,
  requests,
  sessionData,
}: {
  rental: Rental;
  requests: RentalRequest[];
  sessionData: Session;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState<FormValues>({
    note: "",
    rentalPayments: [],
    rentalComplaints: [],
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault();
    try {
      await backendAPI.post(`/api/rentals/rental/${rental.id}/requests/extend`, value, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        }
      });
      closeBtnRef.current?.click();
      setValue({ note: "", rentalPayments: [], rentalComplaints: []});
      toast.success("Đã gửi yêu cầu chấm dứt hợp đồng.");
    } catch(err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu.");
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button" variant="destructive">
          Đề nghị hủy hợp đồng
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đề nghị hủy hợp đồng thuê nhà</DialogTitle>
          <DialogDescription>
            {/* Để đề nghị hủy hợp đồng thuê nhà, vui lòng điền vào mẫu dưới đây và gửi cho chúng tôi. */}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2"></div>
          <div className="space-y-2"></div>
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
