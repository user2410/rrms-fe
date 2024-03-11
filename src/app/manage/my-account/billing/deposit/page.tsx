"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { backendAPI } from "@/libs/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  amount: z.number().positive(),
  bankCode: z.string(),
  language: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DepositPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100000,
      bankCode: "",
      language: "vn",
    },
  });

  async function onSubmit(data: FormValues) {
    const res = (await backendAPI.post("/api/payment/vnpay/create_payment_url", data)).data;
    router.push(res.url);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền</FormLabel>
              <FormControl>
                <Input {...field} type="number"/>
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankCode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Notify me about...</FormLabel>
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
        <Button type="submit">Nạp tiền</Button>
      </form>
    </Form>
  );
};
