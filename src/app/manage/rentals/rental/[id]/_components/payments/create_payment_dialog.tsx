import FieldMoneyDescription from "@/components/complex/field-money_desc";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { backendAPI } from "@/libs/axios";
import { RentalComplaint } from "@/models/rental";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useDataCtx } from "../../_context/data.context";
import { useRef } from "react";
import { paymentTypes } from "@/models/payment";

const formSchema = z.object({
  type: z.enum(["RENTAL", "ELECTRICITY", "WATER", "SERVICE", "MAINTENANCE", "PENALTY"]),
  startDate: z.date(),
  endDate: z.date(),
  amount: z.number(),
  discount: z.number().optional(),
  note: z.string().optional(),
  svcId: z.string().optional(),
}).refine(data => !(['SERVICE', 'MAINTENANCE'].includes(data.type) && !data.svcId), {
  message: `Chọn dịch vụ hoặc lần bảo trì`,
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePaymentDialog() {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { sessionData, rental, payments, setPayments } = useDataCtx();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const type = form.watch('type');
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const svcId = form.watch('svcId');

  const complaintsQuery = useQuery<RentalComplaint[]>({
    queryKey: ["manage", "rentals", "rental", rental.id, 'complaints'],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<RentalComplaint[]>(`/api/rental-complaints/rental/${queryKey[3]}`, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        },
      })).data;
      if (!res) {
        return [];
      }
      return res.map(r => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
        occurredAt: new Date(r.occurredAt),
      }));
    },
    enabled: type === "MAINTENANCE",
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60,
  });

  async function handleSubmit(data: FormValues) {
    console.log("submit", data);
    const code = `${rental.id}_${type}${svcId ? `_${svcId}` : ""}_${type === "MAINTENANCE" ? String(startDate.getDate()+1).padStart(2, '0') : ""}${String(startDate.getMonth()+1).padStart(2, '0')}${startDate.getFullYear()}${type === "MAINTENANCE" ? String(endDate.getDate()+1).padStart(2, '0') : ""}${String(endDate.getMonth()+1).padStart(2, '0')}${endDate.getFullYear()}_M`;
    try {
      const newPayment = (await (backendAPI.post(`/api/rental-payments`, {
        ...data,
        rentalId: rental.id,
        code,
        status: "ISSUED",
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`
        }
      }))).data;
      toast.success("Tạo khoản thu thành công");
      setPayments([...payments, {
        ...newPayment,
        startDate: new Date(newPayment.startDate),
        endDate: new Date(newPayment.endDate),
      }]);
      closeBtnRef.current?.click();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi tạo khoản thu");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabelRequired className="text-base font-semibold">Loại khoản thu</FormLabelRequired>
              <FormControl>
                <RadioGroup
                  onValueChange={(e) => {
                    form.resetField('svcId');
                    field.onChange(e);
                  }}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-2"
                >
                  {[
                    { value: 'RENTAL', label: 'Tiền thuê nhà' },
                    { value: 'ELECTRICITY', label: 'Tiền điện' },
                    { value: 'WATER', label: 'Tiền nước' },
                    { value: 'SERVICE', label: 'Tiền dịch vụ' },
                    { value: 'MAINTENANCE', label: 'Tiền bảo trì' },
                  ].map((item, index) => (
                    <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={item.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {item.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {['SERVICE', 'MAINTENANCE'].includes(type) && (
          <FormField
            control={form.control}
            name="svcId"
            render={({ field }) => (
              <FormItem className="flex flex-row items-end gap-2">
                <div className="space-y-2 flex-grow">
                  <FormLabelRequired>
                    {type === 'SERVICE' ? 'Dịch vụ' : 'Bảo trì'}
                  </FormLabelRequired>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={type === 'SERVICE' ? 'Chọn dịch vụ' : "Chọn lần bảo trì"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(complaintsQuery.isSuccess && type === "MAINTENANCE") && complaintsQuery.data.map((complaint, index) => (
                        <SelectItem value={complaint.id.toString()} key={index}>
                          {complaint.title}&nbsp;{complaint.occurredAt.toLocaleDateString("vi-VN")}
                        </SelectItem>
                      ))}
                      {type === "SERVICE" && rental.services.map((svc, index) => (
                        <SelectItem value={svc.id.toString()} key={index}>
                          {svc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {type === "MAINTENANCE" && (
                  <Button type="button" variant="outline" onClick={() => complaintsQuery.refetch()}>
                    <RotateCcw className="w-6 h-6" />
                  </Button>
                )}
              </FormItem>
            )}
          />
        )}
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Thời gian sử dụng dịch vụ</h4>
          <div className="flex flex-row items-start gap-2">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex-grow space-y-1.5">
                  <FormLabelRequired>Ngày bắt đầu</FormLabelRequired>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value?.toISOString().split("T")[0]}
                      onChange={(e) => {
                        field.onChange(new Date(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex-grow space-y-1.5">
                  <FormLabelRequired>Ngày kết thúc</FormLabelRequired>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      value={field.value?.toISOString().split("T")[0]}
                      onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        if (newDate < startDate) {
                          toast.error("Ngày kết thúc không muộn hơn ngày bắt đầu");
                          return;
                        }
                        field.onChange(newDate);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="text-base font-semibold">Thanh toán</h4>
          <div className="flex flex-row items-start gap-2">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem className="flex-grow space-y-1.5">
                  <FormLabelRequired>Số tiền</FormLabelRequired>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                  <FieldMoneyDescription value={field.value} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem className="flex-grow space-y-1.5">
                  <FormLabelRequired>Chiết khấu</FormLabelRequired>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                    />
                  </FormControl>
                  <FormMessage />
                  <FieldMoneyDescription value={field.value} />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  rows={3}
                  placeholder="Nhập ghi chú"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}/>
        <DialogFooter>
          <DialogClose asChild>
            <button type="button" ref={closeBtnRef} hidden/>
          </DialogClose>
          {JSON.stringify(form.formState.errors)}
          <Button type="submit">Tạo khoản thu</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
