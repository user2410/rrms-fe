import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import { readMoneyVi } from "@/utils/currency";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataCtx } from "../_context/data.context";

export default function Baseprice() {
  const {application} = useDataCtx();
  const form = useFormContext<FormValues>();
  const moveinDate = form.watch('tenant.moveinDate');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Chi phí thuê nhà</CardTitle>
        <CardDescription>Chi phí bên thuê phải trả</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="services.rentalPaymentBasis"
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Chu kỳ thu tiền thuê</FormLabelRequired>
              <Select onValueChange={(v) => {
                const currentRentalPrice = form.getValues('services.rentalPrice');
                const currentBasis = form.getValues('services.rentalPaymentBasis');
                if (currentRentalPrice) {
                  if (v === "YEARLY" && currentBasis === "MONTHLY") {
                    form.setValue('services.rentalPrice', currentRentalPrice * 12);
                  } else if (v === "MONTHLY" && currentBasis === "YEARLY") {
                    form.setValue('services.rentalPrice', currentRentalPrice / 12);
                  }
                }
                field.onChange(v);
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MONTHLY">Hàng tháng</SelectItem>
                  <SelectItem value="YEARLY">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
              {field.value === 'MONTHLY' ? (
                <FormDescription>Tiền thuê nhà sẽ được tổng hợp vào ngày 1 hàng tháng</FormDescription>
              ) : field.value === 'YEARLY' ? (
                <FormDescription>Tiền thuê nhà sẽ được tổng hợp vào ngày {moveinDate.getDate()}/{moveinDate.getMonth()} mỗi 12 tháng</FormDescription>
              ) : null}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="services.rentalPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Giá thuê</FormLabelRequired>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>{field.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} ({readMoneyVi(field.value)})</FormDescription>
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="services.deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Tiền đặt cọc</FormLabelRequired>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>
                  Tiền đặt cọc thuê nhà, đặt 0 nếu không yêu cầu.{" "}
                  {field.value > 0 && `${field.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`} {field.value > 0 && `(${readMoneyVi(field.value)})`}
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="services.depositPaid"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-1 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  Đã trả tiền đặt cọc
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
