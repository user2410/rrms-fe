import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { readMoneyVi } from "@/utils/currency";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import FieldMoneyDescription from "@/components/complex/field-money_desc";

export default function Baseprice() {
  const form = useFormContext<FormValues>();

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
              <FormLabelRequired>Chu kỳ trả tiền thuê</FormLabelRequired>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  onValueChange={(v) => {
                    var basis : number;
                    switch(v) {
                      case "MONTHLY":
                        basis = 1;
                        break;
                      case "QUARTERLY":
                        basis = 3;
                        break;
                      case "YEARLY":
                        basis = 12;
                        break;
                      default:
                        basis = 2;
                    }
                    field.onChange(basis);
                  }}
                  defaultValue="MONTHLY"
                >
                  <SelectTrigger className={field.value === 1 ? "col-span-3" : "col-span-2"}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Hàng tháng</SelectItem>
                    <SelectItem value="QUARTERLY">Hàng quý</SelectItem>
                    <SelectItem value="YEARLY">Hàng năm</SelectItem>
                    <SelectItem value="UPFRONT"></SelectItem>
                  </SelectContent>
                </Select>
                {field.value !== 1 && (
                  <div className="flex flex-row items-center gap-1">
                    <FormControl>
                      <Input {...field} type="number" min={2} max={form.watch('tenant.rentalPeriod')} className="flex-grow"/>
                    </FormControl>
                    <span>tháng</span>
                  </div>
                )}
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="services.paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Trả tiền</FormLabelRequired>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PREPAID">Trả trước</SelectItem>
                  <SelectItem value="POSTPAID">Trả sau</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {field.value === "PREPAID" 
                ? "Tiền thuê được tính vào đầu mỗi kỳ thuê nhà" 
                : "Tiền thuê được tính vào đầu mỗi kỳ thuê nhà"}
              </FormDescription>
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
              <FieldMoneyDescription value={field.value}/>
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
