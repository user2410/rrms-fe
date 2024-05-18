import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";
import { Input } from "@/components/ui/input";
import { addMonths } from "date-fns";

export default function ExtendLease() {
  const form = useFormContext<FormValues>();
  const startDate = form.watch("tenant.startDate");
  const rentalPeriod = form.watch("tenant.rentalPeriod");
  const maxNoticePeriod = useMemo(() => {
    const endDate = addMonths(startDate, rentalPeriod);
    return Math.floor((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
  }, [startDate, rentalPeriod]);
  const [enabled, setEnabled] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Gia hạn hợp đồng
        </CardTitle>
        <CardDescription>Thiết đặt thông báo tới bên thuê về thời hạn thuê</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <Switch 
            id="enable" 
            checked={enabled} 
            onCheckedChange={(c) => {
              setEnabled(!!c);
              if(!c) {
                form.setValue("noticePeriod", 0);
              }
            }}
          />
          <Label htmlFor="enable">Thông báo tới bên thuê về thời hạn thuê</Label>
        </div>
        {enabled && (
          <FormField
            control={form.control}
            name="noticePeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Thông báo tới bên thuê trước</FormLabelRequired>
                <div className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min={1}
                      max={maxNoticePeriod}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    />
                  </FormControl>
                  <p>tháng</p>
                </div>
              </FormItem>
            )}
          />
        )}
      </CardContent>
    </Card>
  );
};
