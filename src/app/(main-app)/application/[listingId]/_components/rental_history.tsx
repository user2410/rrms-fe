import DivisionSelector from "@/components/complex/division-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";
import { ApplicationForm } from "./main_form";

export default function RentalHistory() {
  const form = useFormContext<ApplicationForm>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử thuê nhà</CardTitle>
        <CardDescription>Thông tin về lần thuê nhà gần đây nhất của bạn. Khuyến nghị cung cấp thông tin để chủ nhà nắm rõ nhu cầu của bạn hơn. Nếu không có xin hãy bỏ qua.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <FormField
          name="yd.rhAddress"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <DivisionSelector
          cityFieldName="yd.rhCity"
          districtFieldName="yd.rhdistrict"
          wardFieldName="yd.rhWard"
        />
        <div className="grid grid-cols-2 gap-2">
          <FormField
            name="yd.rhRentalDuration"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tôi đã thuê ở đây (tháng)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="yd.rhMonthlyPayment"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá thuê hàng tháng (triệu)</FormLabel>
                <Input type="number" {...field} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
              </FormItem>
            )}
          />
          <FormField
            name="yd.rhReasonForLeaving"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-2 col-span-2">
                <FormLabel>Lý do dừng thuê nhà</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="due" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Hết hạn thuê
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cancel" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Chấm dứt hợp đồng thuê
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="other" />
                      </FormControl>
                      <FormLabel className="font-normal">Lý do khác</FormLabel>
                      {form.watch('yd.rhReasonForLeaving') === 'other' && (
                        <Textarea className="flex-1" rows={3} onChange={(e) => field.onChange(`other_${e.currentTarget.value}`)} />
                      )}
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
