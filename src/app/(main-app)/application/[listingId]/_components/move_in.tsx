import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";
import { ApplicationForm } from "./main_form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from "clsx";

// transalte actual field value: "[OTHER] Cho thuê mặt bằng" to ""
function displayRentalIntention(value: string) {

}
export default function MoveIn() {
  const form = useFormContext<ApplicationForm>();

  return (
    <Fragment>
      <CardHeader>
        <CardTitle>Chuyển tới thuê</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name="ao.moveinDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày dự kiến chuyển tới thuê</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value && format(field.value, "yyyy-MM-dd")}
                  onChange={(e) => {
                    if (!e.currentTarget.value) return;
                    field.onChange(new Date(e.currentTarget.value));
                  }}
                  min={format(new Date(), "yyyy-MM-dd")}
                  className="w-full p-3"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ao.preferredTerm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời gian thuê dự kiến (tháng)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="col-span-2 flex flex-row items-end gap-3">
          <FormField
            control={form.control}
            name="ao.rentalIntention"
            render={({ field }) => (
              <FormItem className="flex-none">
                <FormLabel>Mục đích thuê</FormLabel>
                <Select 
                  defaultValue={field.value}
                  // value={field.value.startsWith("[OTHER]") ? "[OTHER]" : field.value}
                  onValueChange={field.onChange} 
                >
                  <FormControl>
                    <SelectTrigger className="space-x-2">
                      <SelectValue placeholder="Chọn mục đích thuê trọ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="[RESIDENCE]">Để ở</SelectItem>
                    <SelectItem value="[BUSINESS]">Kinh doanh</SelectItem>
                    <SelectItem value="[OFFICE]">Văn phòng</SelectItem>
                    <SelectItem value="[TENANCY]">Nhà trọ</SelectItem>
                    {/* <SelectItem value="[OTHER]">Khác</SelectItem> */}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="ao.rentalIntention"
            render={({ field }) => (
              <FormItem className={clsx(
                "flex-auto",
                field.value.startsWith("[OTHER]") ? "block" : "hidden",
              )}>
                <FormLabel/>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder="Mục đích thuê khác"
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}
        </div>
      </CardContent>
    </Fragment>
  );
};
