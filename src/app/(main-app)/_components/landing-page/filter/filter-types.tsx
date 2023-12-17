import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { mapPropertyTypeToText } from "@/models/property";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../search-bar";

export default function PropTypesFilter() {
  const form = useFormContext<SearchFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loại bất động sản</CardTitle>
        <CardDescription>Chọn loại bất động sản bạn muốn tìm kiếm.</CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="ptypes[]"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(mapPropertyTypeToText).map((item) => (
                  <FormField
                    key={item[0]}
                    control={form.control}
                    name="ptypes[]"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item[0]}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item[0])}
                              onCheckedChange={(checked) => checked
                                  ? field.onChange([...field.value, item[0]])
                                  : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item[0]
                                    )
                                  )
                              }
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item[1]}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter className="justify-end">
        <Button type="button" variant="outline" onClick={() => form.resetField("ptypes[]")}>
          Đặt lại
        </Button>
      </CardFooter>
    </Card>
  );
}
