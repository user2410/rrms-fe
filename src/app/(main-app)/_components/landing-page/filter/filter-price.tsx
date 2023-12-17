import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../search-bar";

export default function PriceFilter() {
  const form = useFormContext<SearchFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mức giá</CardTitle>
        <CardDescription>Chọn giá thuê tối thiểu và tối đa một tháng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="lminPrice"
            render={({ field }) => (
              <FormItem className="flex gap-2">
                <FormControl>
                  <Input type="number" className="w-20" min={form.watch('lmaxPrice')} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                </FormControl>
                <FormDescription>triệu</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lmaxPrice"
            render={({ field }) => (
              <FormItem className="flex gap-2">
                <FormControl>
                  <Input type="number" className="w-20" min={form.watch('lminPrice')} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                </FormControl>
                <FormDescription>triệu</FormDescription>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" variant="outline" onClick={() => {
          form.setValue("lminPrice", Number.NEGATIVE_INFINITY);
          form.setValue("lmaxPrice", Number.POSITIVE_INFINITY);
        }}>
          Đặt lại
        </Button>
      </CardFooter>
    </Card>
  );
}
