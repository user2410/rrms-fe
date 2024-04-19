import FieldMoneyDescription from "@/components/complex/field-money_desc";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { backendAPI } from "@/libs/axios";
import { getRentalPaymentReason, RentalPayment, RENTALPAYMENTSTATUS } from "@/models/rental";
import { readMoneyVi } from "@/utils/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { addDays, format } from "date-fns";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useDataCtx } from "../../_context/data.context";

const formSchema = z.object({
  amount: z.number(),
  discount: z.number().optional(),
  expiryDate: z.date(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PlanDialog({
  payment,
}: {
  payment: RentalPayment;
}) {
  const { sessionData, changePayment } = useDataCtx();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: payment.amount,
      discount: payment.discount || undefined,
      expiryDate: payment.expiryDate || undefined,
    },
  });
  const amount = form.watch("amount");
  const discount = form.watch("discount");
  const total = useMemo(() => amount - (discount || 0), [amount, discount]);

  async function handleSubmit() {
    try {
      const isValid = await form.trigger();
      if (!isValid) {
        console.error(form.formState.errors);
        throw {message: "Kiểm tra lại các trường thông tin"};
      }
      const data = {
        ...form.getValues(),
        id: payment.id,
        status: "ISSUED",
      };
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/plan`, data, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      });
      changePayment({
        ...payment,
        ...data,
      } as RentalPayment);
      toast.success("Cập nhật thành công");
      closeBtnRef.current?.click();
    } catch (err: any) {
      console.error(err);
      toast.error(`Có lỗi xảy ra: ${err.message}`);
    }
  }

  async function handleCancel() {
    try {
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/plan`, {
        expiryDate: new Date(),
        amount: payment.amount,
        status: "CANCELLED",
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      });
      changePayment({
        ...payment,
        status: "CANCELLED",
      } as RentalPayment);
      toast.success("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  async function handlePaid() {
    try {
      await backendAPI.patch(`/api/rental-payments/rental-payment/${payment.id}/plan`, {
        id: payment.id,
        expiryDate: new Date(),
        amount: payment.amount,
        status: "PAID",
      }, {
        headers: {
          Authorization: `Bearer ${sessionData?.user.accessToken}`,
        }
      });
      changePayment({
        ...payment,
        status: "PAID",
      } as RentalPayment);
      toast.success("Cập nhật thành công");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger>
        <Button>Chi tiết</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Cập nhật và xét duyệt khoản thu</DialogTitle>
          <DialogDescription>
            {(payment.note && payment.note.length > 0) ? `Kiến nghị của bên thuê: ${payment.note}` : "Cần thực hiện sớm để thông báo đến bên thuê và bên thuê chuẩn bị."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Mã hóa đơn</Label>
              <p className="text-sm">{payment.code}</p>
            </div>
            <div className="space-y-2">
              <Label>Dịch vụ</Label>
              <p className="text-sm">{getRentalPaymentReason(payment)}</p>
            </div>
            <div className="space-y-2">
              <Label>Từ ngày</Label>
              <p className="text-sm">{payment.startDate.toLocaleDateString("vi-VN")}</p>
            </div>
            <div className="space-y-2">
              <Label>Đến ngày</Label>
              <p className="text-sm">{payment.endDate.toLocaleDateString("vi-VN")}</p>
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Số tiền</FormLabelRequired>
                    <FormControl>
                      <Input {...field} type="number" onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
                    </FormControl>
                    <FieldMoneyDescription value={field.value} />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khấu trừ</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        onChange={(e) => {
                          const v = e.currentTarget.valueAsNumber;
                          if (v < amount) {
                            field.onChange(v);
                          }
                        }}
                        type="number" 
                      />
                    </FormControl>
                    <FieldMoneyDescription value={field.value} />
                  </FormItem>
                )}
              />
            </div>
            <p className="col-span-2 text-sm font-light">Số tiền phải trả: {total.toLocaleString("vi-VN", { style: 'currency', currency: 'VND' })} ({readMoneyVi(total)})</p>
            <div className="space-y-2 col-span-2">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Hạn nộp</FormLabelRequired>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        value={field.value && format(field.value, "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (!e.currentTarget.value) return;
                          field.onChange(new Date(e.currentTarget.value));
                        }}
                        min={format(addDays(new Date(), 1), "yyyy-MM-dd")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild><button type="button" ref={closeBtnRef} hidden/></DialogClose>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">Hủy hóa đon</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tiếp tục?</AlertDialogTitle>
                <AlertDialogDescription>
                  Hóa đơn này sẽ bị hủy và không thể khôi phục.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => closeBtnRef.current?.click()}>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancel}>Đồng ý</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" className="bg-green-400">Đã thanh toán</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận thanh toán</AlertDialogTitle>
                <AlertDialogDescription>
                  Hóa đơn này đã được thanh toán.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => closeBtnRef.current?.click()}>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handlePaid}>Đồng ý</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Xác nhận</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tiếp tục?</AlertDialogTitle>
                <AlertDialogDescription>
                  Chấp nhận hóa đơn này và gửi thông báo đến bên thuê.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => closeBtnRef.current?.click()}>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>Đồng ý</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  );
};
