import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Editor from "@/components/ui/editor";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { ListingFormValues } from "../page";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export default function Step3Basic() {
  const form = useFormContext<ListingFormValues>();
  const { fields, append, remove } = useFieldArray<ListingFormValues>({
    control: form.control,
    name: "listing.tags",
  });

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
              <FormLabelRequired>Tiêu đề</FormLabelRequired>
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
                <FormLabelRequired>Mô tả</FormLabelRequired>
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
              <FormDescription>Tối thiểu 30 ký tự</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <Label>
            Từ khóa bài đăng (tối đa 5 từ khóa, mỗi từ tối đa 32 ký tự)
            {fields.length > 0 && (
              <div className="hidden gap-1 lg:flex">
                {fields.map((field, i) => (
                  <Badge
                    key={field.id}
                    variant="secondary"
                    className="rounded-sm px-1 font-normal hover:cursor-pointer"
                    onClick={() => remove(i)}
                  >
                    {
                      // @ts-ignore
                      field.tag
                    }
                  </Badge>
                ))}
              </div>
            )}
          </Label>
          <Input 
            placeholder="Nhập từ khóa, nhấn Enter để tạo" 
            onKeyDown={(e) => {
              const v = e.currentTarget.value.trim();
              if (e.key === "Enter" && fields.length < 5 && v !== ""){
                e.preventDefault();
                append({ tag: v });
                e.currentTarget.value = "";
              }
            }}
          />
          <div className="text-sm text-muted-foreground">
            Từ khóa tìm kiếm giúp bài đăng của bạn dễ tìm kiếm hơn
            <ul className="list-disc list-inside">
              <li>Xác định từ khóa bằng cách trả lời câu hỏi: &quot;Nhà cho thuê của tôi có đặc điểm gì ?&quot;</li>
              <li>Chọn những từ khóa đáng chú ý nhất về nhà cho thuê của bạn</li>
              <li>Nên chọn những từ khóa được gợi ý</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
