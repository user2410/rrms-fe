import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Fragment } from "react";
import { useFormContext } from "react-hook-form";
import { ApplicationForm } from "./main_form";

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
            <FormItem className="flex flex-col">
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
            <FormItem className="flex flex-col">
              <FormLabel>Thời gian thuê (tháng)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Fragment>
  );
};
