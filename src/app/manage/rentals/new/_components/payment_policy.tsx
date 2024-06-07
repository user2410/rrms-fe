import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldArray, useForm, useFormContext, UseFormReturn } from "react-hook-form";
import { FormValues } from "../page";
import { Input } from "@/components/ui/input";
import FieldMoneyDescription from "@/components/complex/field-money_desc";
import FormLabelWithInfo from "@/components/complex/label-with-info";
import Link from "next/link";

export default function PaymentPolicy() {
  const form = useFormContext<FormValues>();
  const latePaymentPenaltyScheme = form.watch('policies.latePaymentPenaltyScheme');
  const latePaymentPenaltyAmount = form.watch('policies.latePaymentPenaltyAmount');

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div className="space-y-2">
          <CardTitle className="text-lg">Mức xử phạt nộp tiền thuê nhà muộn</CardTitle>
          <CardDescription>Thiết đặt phương thức xử lý trường hợp khách thuê nộp tiền thuê nhà muộn</CardDescription>
        </div>
        <FormField
          control={form.control}
          name="policies.enableLatePaymentPenalty"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardHeader>
      {form.watch("policies.enableLatePaymentPenalty") && (
        <CardContent className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="policies.latePaymentPenaltyScheme"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Tính phí trễ hạn</FormLabelRequired>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Hình thức tính phí trễ hạn" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PERCENT">Phần trăm</SelectItem>
                    <SelectItem value="FIXED">Cố định</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {latePaymentPenaltyScheme === 'PERCENT' ? (
            <FormField
              name="policies.latePaymentPenaltyAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabelWithInfo
                    label="Lãi suất"
                    info={(
                      <div className="text-muted-foreground text-sm max-w-xl">
                        Các bên có thỏa thuận mức lãi trên số tiền chậm thanh toán. Theo đó, lãi suất phát sinh do chậm trả tiền được xác định theo thỏa thuận của các bên nhưng không được vượt quá mức lãi suất được quy định tại khoản 1 Điều 468 Bộ luật Dân sự 2015 (không quá 20%/ năm).
                        <Link 
                          href="https://thuvienphapluat.vn/banan/tin-tuc/ban-ve-lai-suat-cham-thanh-toan-trong-hop-dong-mua-ban-hang-hoa-5829"
                          className="text-blue-600 underline"
                        >
                          Tham khảo
                        </Link>
                      </div>
                    )}
                    required
                  />
                  <div className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        max={20}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <p className="text-muted-foreground">%/năm</p>
                  </div>
                  {latePaymentPenaltyAmount && (
                    <FormDescription>
                      {`${latePaymentPenaltyAmount}%/năm số tiền còn nợ`}
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          ) : latePaymentPenaltyScheme === 'FIXED' && (
            <FormField
              name="policies.latePaymentPenaltyAmount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabelRequired>Mức phạt</FormLabelRequired>
                  <div className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={0}
                        max={form.watch('services.rentalPrice')}
                      />
                    </FormControl>
                    <p className="text-muted-foreground">VNĐ</p>
                  </div>
                  <FormDescription>
                    {`${latePaymentPenaltyAmount}%/năm số tiền còn nợ`}
                  </FormDescription>
                </FormItem>
              )}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
};
