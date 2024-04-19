import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RentalPayment } from "@/models/rental";

export default function ConfirmPaymentDialog({
  payment,
} : {
  payment: RentalPayment;
}) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Xác nhận thanh toán</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật và xét duyệt khoản thu</DialogTitle>
          <DialogDescription>
            Cần thực hiện sớm để bên thuê chuẩn bị.
          </DialogDescription>
        </DialogHeader>
        
      </DialogContent>
    </Dialog>
  );
};
