"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { backendAPI } from "@/libs/axios";
import { Payment } from "@/models/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  bankCode: z.string(),
  language: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PaymentPage({ params: { id } }: { params: { id: string } }) {
  const session = useSession();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bankCode: "",
      language: "vn",
    },
  });

  const query = useQuery<Payment>({
    queryKey: ["manage", "payment", id, session.data?.user.accessToken],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<Payment>("/api/payments/payment/" + id, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
      })).data;
    },
    enabled: session.status === "authenticated",
  });

  async function handlePayment(data: FormValues) {
    try {
      const res = (await axios.post("/api/payment/get_vnpay_url", {
        id,
        origin: window.location.origin,
        ...data,
        accessToken: session.data?.user.accessToken,
      })).data;
      window.open (res.url, '_ blank');
      router.push("/manage/payments/payment/" + id + "/success");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi tạo thanh toán");
    }
  }

  return (
    <div className="w-full flex flex-row justify-center">
      {query.isLoading ? (
        <Spinner />
      ) : query.isError ? (
        <>{JSON.stringify(query.error)}</>
      ) : (() => {
        const p = query.data;
        p.createdAt = new Date(p.createdAt);

        return (
          <div className="container h-full py-10">
            <Card>
              <CardHeader>
                <CardTitle>Hoá đơn #{id}</CardTitle>
                <CardDescription>
                  Hoá đơn tạo {p.createdAt.toLocaleTimeString("vi-VN")} ngày {p.createdAt.toLocaleDateString("vi-VN")} <br />
                  Thông tin đơn hàng: {p.orderInfo.slice(p.orderInfo.indexOf("]") + 1)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Đơn giá</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Chiết khấu</TableHead>
                      <TableHead className="text-right">Tổng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {p.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.discount}%</TableCell>
                        <TableCell className="text-right">{((item.price * item.quantity) * (100 - item.discount) / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>Tổng cộng</TableCell>
                      <TableCell className="text-right">{p.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
              <Separator />
              <CardFooter>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handlePayment)} className="space-y-2">
                    <FormField
                      control={form.control}
                      name="bankCode"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Chọn Phương thức thanh toán</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Cổng thanh toán VNPAYQR
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="VNPAYQR" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Thanh toán qua ứng dụng hỗ trợ VNPAYQR
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="VNBANK" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Thanh toán qua ATM-Tài khoản ngân hàng nội địa
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="INTCARD" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Thanh toán qua thẻ quốc tế
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="language"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Ngôn ngữ</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="vn" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Tiếng Việt
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="en" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Tiếng Anh
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      disabled={p.status === "SUCCESS"}
                      type="submit"
                    >
                      {p.status === "FAILED" ? "Thanh toán lại" : "Thanh toán"}
                    </Button>
                  </form>
                </Form>
              </CardFooter>
            </Card>
          </div>
        );
      })()}
    </div>
  );
};
