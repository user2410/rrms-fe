import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { readMoneyVi } from "@/utils/currency";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import FormLabelWithInfo from "@/components/complex/label-with-info";
import { cn } from "@/libs/utils";

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
                    var basis: number;
                    switch (v) {
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
                      <Input {...field} type="number" min={2} max={form.watch('tenant.rentalPeriod')} className="flex-grow" />
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
                    <SelectValue />
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
              <FormDescription>
                Khách hàng phải trả mỗi {form.watch("services.rentalPaymentBasis")} tháng: {field.value ? `${field.value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}` : ""} {field.value ? `(${readMoneyVi(field.value)})` : ""}</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="policies.gracePeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabelRequired>Thời gian ân hạn</FormLabelRequired>
              <div className="flex flex-row items-center gap-2">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>ngày</FormDescription>
              </div>
              <FormDescription>Khoảng thời gian sau hạn trả tiền thuê mà khách thuê không bị tính phí trễ hạn</FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
