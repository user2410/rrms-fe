import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Editor from "@/components/ui/editor";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ListingFormValues } from "../page";

export default function Step3Basic() {
  const form = useFormContext<ListingFormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin bài đăng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="listing.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề <span className="ml-1 text-red-600">*</span></FormLabel>
              <FormControl>
                <Input {...field} maxLength={99} />
              </FormControl>
              <FormDescription>Tối thiểu 30 ký tự, tối đa 99 ký tự</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="listing.description"
          render={({ field }) => (
            <FormItem>
              <div className="w-full flex flex-row justify-between items-center">
                <FormLabel>Mô tả <span className="ml-1 text-red-600">*</span></FormLabel>
                <div className="flex flex-row items-center gap-2">
                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => form.setValue("listing.description", "")}
                  >
                    Xóa mô tả
                  </Button>
                  {(() => {
                    const d = form.getValues("propertyData").property.description;
                    return d ? (
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => form.setValue("listing.description", d)}
                      >
                        Sử dụng mô tả nhà cho thuê
                      </Button>
                    ) : null;
                  })()}
                </div>
              </div>
              <FormControl>
                <Editor 
                  {...field} 
                />
              </FormControl>
              <FormDescription>Tối thiểu 30 ký tự, tối đa 3.000 ký tự</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
