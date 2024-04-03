import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import { readMoneyVi } from "@/utils/currency";

export default function Baseprice() {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Chi phí thuê nhà</CardTitle>
        <CardDescription>Chi phí bên thuê phải trả</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2">
        <FormField
          control={form.control}
          name="rentalPrice"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabelRequired>Giá thuê hàng tháng</FormLabelRequired>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormDescription>{field.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} ({readMoneyVi(field.value)})</FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
