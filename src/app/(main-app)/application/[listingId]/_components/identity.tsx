import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, sub } from "date-fns";
import { useFormContext } from "react-hook-form";
import { ApplicationForm } from "./main_form";

export default function Identity() {
  const form = useFormContext<ApplicationForm>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giấy tờ tùy thân</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <FormField
            name="yd.identityType"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại giấy tờ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ID">Chứng minh nhân dân</SelectItem>
                    <SelectItem value="CITIZENIDENTIFICATION">Căn cước công dân</SelectItem>
                    <SelectItem value="PASSPORT">Hộ chiếu</SelectItem>
                    <SelectItem value="DRIVERLICENSE">Bằng lái xe</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            name="yd.identityNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã số</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="yd.identityIssuedDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày cấp</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value && format(field.value, "yyyy-MM-dd")}
                    onChange={(e) => {
                      if (!e.currentTarget.value) return;
                      form.setValue("yd.identityIssuedDate", new Date(e.currentTarget.value));
                    }}
                    max={format(sub(new Date(), { years: 18 }), "yyyy-MM-dd")}
                    className="w-full p-3"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="yd.identityIssuedBy"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nơi cấp</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
