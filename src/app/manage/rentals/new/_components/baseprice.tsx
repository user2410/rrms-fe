import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import { readMoneyVi } from "@/utils/currency";
import { Checkbox } from "@/components/ui/checkbox";

export default function Baseprice() {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Chi phí thuê nhà</CardTitle>
        <CardDescription>Chi phí bên thuê phải trả</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <FormField
          control={form.control}
          name="rentalPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Giá thuê hàng tháng</FormLabelRequired>
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
            name="deposit"
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
                <FormDescription>{field.value && `${field.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`} {field.value && `(${readMoneyVi(field.value)})`}</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="depositPaid"
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
