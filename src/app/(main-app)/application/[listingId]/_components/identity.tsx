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
        </div>
      </CardContent>
    </Card>
  );
};
