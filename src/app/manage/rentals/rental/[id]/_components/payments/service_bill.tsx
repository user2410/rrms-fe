import { Bill, CaptchaResponse, Supplier, SupplierGroup } from "@/app/manage/rentals/_models/service_suppliers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  group: z.number(),
  provider: z.string(),
  customer_code: z.string(),
  captcha_answer: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

type Data = {
  productName: string;
  suppliers: Supplier[];
  supplier_groups: SupplierGroup[];
}

export default function ServiceBill({
  productId,
  groupTitle,
  defaultValues,
}: {
  productId: string;
  groupTitle: string;
  defaultValues: Partial<FormValues>;
}) {
  const [stage, setStage] = useState<"form" | "result">("form");
  const [bill, setBill] = useState<Bill | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const providersQuery = useQuery<Data>({
    queryKey: ["rental_services", "providers", productId],
    queryFn: async ({ queryKey }) => {
      return (await axios.get<Data>(`/api/payment/rental_services/providers?productId=${queryKey.at(2)}`)).data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
  });
  const captchaQuery = useQuery<CaptchaResponse>({
    queryKey: ["rental_services", "providers", productId, "captcha"],
    queryFn: async ({ queryKey }) => {
      const res = (await axios.get<CaptchaResponse>(`/api/payment/rental_services/captcha?productId=${queryKey.at(2)}`)).data;

      return res;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });
  const selectedGroup = form.watch("group");

  async function submitHandler(data: FormValues) {
    try {
      const res = await axios.get<Bill>("/api/payment/rental_services/bill", {
        params: {
          ...data,
          productId,
          captcha_id: captchaQuery.data?.captcha_id,
        },
      });
      setBill(res.data);
      setStage("result");
    } catch (err: any) {
      console.log("err", err);
      switch (err.response.status) {
        case 401:
          toast.error("Mã Captcha sai hoặc hết hiệu lực");
          break;
        case 404:
          toast.error("Không tìm thấy hóa đơn");
          break;
        default:
          toast.error("Lỗi máy chủ");
      }
    }
    captchaQuery.refetch();
  }

  return (
    <Dialog onOpenChange={(_open) => {
      form.reset();
      setStage("form");
    }}>
      <DialogTrigger>
        <Button type="button" variant="outline">
          Tra cứu hóa đơn {providersQuery.data?.productName.toLowerCase() || (<Spinner size={16} />)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[60vw]">
        <DialogHeader />
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            Tra cứu hóa đơn {providersQuery.data?.productName.toLowerCase() || (<Spinner size={16} />)}
          </h3>
          {stage === "form" ? (
            <Form {...form}>
              <form className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="group"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabelRequired>{groupTitle}</FormLabelRequired>
                      <FormControl>
                        <div className="flex flex-row gap-2">
                          {providersQuery.isSuccess ? (
                            providersQuery.data.supplier_groups.map((sg: any, index: number) => (
                              <Badge key={index}
                                variant={selectedGroup === sg.supplier_group_id ? "default" : "outline"}
                                className="text-center hover:cursor-pointer p-2"
                                onClick={() => field.onChange(sg.supplier_group_id)}
                              >
                                {sg.name.startsWith("Nước") ? sg.name.split("Nước ")[1] : sg.name}
                              </Badge>
                            ))
                          ) : providersQuery.isLoading ? (
                            <Spinner size={16} />
                          ) : null}
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provider"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabelRequired>Nhà cung cấp</FormLabelRequired>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[50vh]">
                          <SelectGroup>
                            <SelectLabel>Nhà cung cấp</SelectLabel>
                            {providersQuery.data?.suppliers.
                              filter((s) => s.group_id === selectedGroup).
                              map((s, index) => (
                                <SelectItem value={s.name} key={index}>
                                  <div className="flex flex-row items-center gap-2">
                                    <img
                                      src={`https://stccps.zpapps.vn/input/logo/${s.icon}@3x.png?v=2051?w=3840`}
                                      alt="supplier-logo" loading="lazy" width="18" height="18" decoding="async" data-nimg="1" className="min-w-[18px]" sizes="100vw"
                                    />
                                    <Label>{s.name}</Label>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customer_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelRequired>Mã khách hàng</FormLabelRequired>
                      <FormControl>
                        <Input {...field} placeholder="Mã khách hàng" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="captcha_answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabelRequired>Mã Captcha</FormLabelRequired>
                      <div className="flex flex-row items-center">
                        <FormControl>
                          <Input {...field} placeholder="Mã Captcha" />
                        </FormControl>
                        {captchaQuery.isSuccess ? (
                          <img src={captchaQuery.data!.base64_image} width="96" height="42" />
                        ) : captchaQuery.isLoading ? (
                          <Spinner size={16} />
                        ) : null}
                        <Button variant="outline" onClick={() => captchaQuery.refetch()}><RefreshCcw className="w-6 h-6" /></Button>
                      </div>
                    </FormItem>

                  )}
                />
              </form>
            </Form>
          ) : bill ? (
            <div className="space-y-4">
              <div className="mb-2 flex flex-col items-center md:mb-3">
                <img alt="payment-bill-artwork" loading="lazy" width="180" height="180" decoding="async" data-nimg="1" className="m-auto mb-1 h-[60px] w-[60px] md:mb-4 md:h-[180px] md:w-[180px]" src="https://scdn.zalopay.com.vn/telco/webpayment/_next/static/media/payment_bill.9431884b.svg" style={{color: "transparent"}}/>
                <div className="text-heading-lg">Chưa tới kỳ thanh toán</div>
              </div>
              <div className="space-y-2">
                <Label>Thông tin khách hàng</Label>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-left">Mã khách hàng</TableCell>
                      <TableCell className="text-right">{bill.customer_code}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-left">Tên khách hàng</TableCell>
                      <TableCell className="text-right">{bill.customer_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-left">Địa chỉ</TableCell>
                      <TableCell className="text-right">{bill.customer_address}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : null}
        </div>
        <DialogFooter>
          {stage === "form" ? (
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              onClick={form.handleSubmit(submitHandler)}
            >
              Tiếp tục
            </Button>
          ) : (
            <DialogClose asChild>
              <Button type="submit">Lưu</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
