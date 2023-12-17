import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../search-bar";

export default function AreaFilter() {
  const form = useFormContext<SearchFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diện tích</CardTitle>
        <CardDescription>Chọn diện tích tối thiểu và tối đa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <FormField
            control={form.control}
            name="pminArea"
            render={({ field }) => (
              <FormItem className="flex gap-2">
                <FormControl>
                  <Input type="number" className="w-20" min={form.watch('pmaxArea')} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                </FormControl>
                <FormDescription>m<sup>2</sup></FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pmaxArea"
            render={({ field }) => (
              <FormItem className="flex gap-2">
                <FormControl>
                  <Input type="number" className="w-20" min={form.watch('pminArea')} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                </FormControl>
                <FormDescription>m<sup>2</sup></FormDescription>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" variant="outline" onClick={() => {
          form.setValue("pminArea", Number.NEGATIVE_INFINITY);
          form.setValue("pmaxArea", Number.POSITIVE_INFINITY);
        }}>
          Đặt lại
        </Button>
      </CardFooter>
    </Card>
  );
}
