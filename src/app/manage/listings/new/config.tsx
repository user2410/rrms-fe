import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { listingDiscount, listingPriorities } from "@/models/listing";
import { add, format } from "date-fns";
import Link from "next/link";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { ListingFormValues } from "./page";

export default function ListingConfig() {
  const form = useFormContext<ListingFormValues>();

  const postDuration = form.watch("config.postDuration");
  // const postAt = form.watch("config.postAt");
  const priority = form.watch("config.priority");

  const expiryDate = useMemo(() => {
    if (!postDuration) return null;
    return add(new Date(), { days: postDuration });
  }, [postDuration]);
  const listingPriority = useMemo(() => {
    if (!priority) return null;
    return listingPriorities.find(item => item.priority.toString() === priority.toString());
  }, [priority]);
  const discountedBasePrice = useMemo(() => {
    if (!postDuration || !listingPriority) return null;
    const ld = listingDiscount.find(item => item.duration.toString() === postDuration.toString());
    return (100 - ld!.discount) / 100 * listingPriority!.basePrice;
  }, [postDuration, listingPriority]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình tin đăng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="config.priority"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Chọn loại tin đăng</FormLabelRequired>
                <FormDescription>
                  <Link href="#">So sánh các loại tin</Link>
                </FormDescription>
                <FormMessage />
                <RadioGroup
                  onValueChange={(e) => field.onChange(parseInt(e))}
                  defaultValue={field.value.toString()}
                  className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-2"
                >
                  {listingPriorities.map((item, index) => (
                    <FormItem key={index}>
                      <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                        <FormControl>
                          <RadioGroupItem value={item.priority.toString()} className="sr-only" />
                        </FormControl>
                        <div className="rounded-md border-2 border-muted p-4 hover:border-accent flex flex-col items-center gap-2">
                          <h3 className="text-foreground font-medium">{item.label}</h3>
                          <p className="text-muted-foreground text-sm text-center">{item.desc}</p>
                        </div>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormItem>
            )}
          />
          <Separator className="my-4" />
          <div className="space-y-4">
            <Label className="text-base my-2">Chọn thời gian đăng tin</Label>
            <FormField
              control={form.control}
              name="config.postDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian đăng tin<span className="ml-1 text-red-600">*</span></FormLabel>
                  <FormMessage />
                  <RadioGroup
                    onValueChange={(e) => field.onChange(parseInt(e))}
                    defaultValue={field.value.toString()}
                    className="grid w-full grid-cols-3 gap-8 pt-2"
                  >
                    {listingDiscount.map((item, index) => (
                      <FormItem key={index}>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                          <FormControl>
                            <RadioGroupItem value={item.duration.toString()} className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent flex justify-between items-center gap-2 max-w-xs">
                            <div className="space-y-2">
                              <h3 className="text-foreground font-medium">{item.duration} ngày</h3>
                              <p className="text-muted-foreground text-sm">{(100 - item.discount) / 100 * listingPriority!.basePrice} đ/ngày</p>
                            </div>
                            <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{item.discount}%</span>
                          </div>
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="config.active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-2">
                    <FormLabel>Ngày đăng tin <span className="ml-1 text-red-600">*</span></FormLabel>
                    <FormField
                      control={form.control}
                      name="config.postAt"
                      render={({ field: field2 }) => (
                        <FormItem className={form.watch("config.active") ? "hidden" : ""}>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field2}
                              value={field2.value ? format(field2.value, "yyyy-MM-dd'T'HH:mm") : ""}
                              onChange={(e) => field2.onChange(e.target.valueAsDate)}
                              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                            />
                          </FormControl>
                        </FormItem>
                      )} />
                    <FormDescription>
                      {endDate && `Hết hạn ${format(endDate, "HH:mm dd/MM/yyyy")}`}
                    </FormDescription>
                    <FormMessage />
                  </div>
                  <div className="flex items-center gap-2">
                    <FormLabel>Đăng ngay</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(e) => {
                          field.onChange(e);
                          if (e) {
                            form.setValue("config.postAt", new Date());
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            /> */}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="font-light">Loại tin</div>
              <div className="font-medium">{listingPriority ? listingPriority.label : "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-light">Đơn giá / ngày</div>
              <div className="font-medium">{listingPriority ? `${discountedBasePrice} đ` : "N/A"}</div>
            </div>
            <div className="flex justify-between">
              <div className="font-light">Thời gian đăng tin</div>
              <div className="font-medium">{(postDuration && expiryDate) ? `${postDuration} ngày (hết hạn ${format(expiryDate, "dd/MM/yyyy")})` : "N/A"}</div>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between">
            <div className="font-light">Phí đăng tin</div>
            <div className="font-medium">{discountedBasePrice ? `${discountedBasePrice * postDuration} đ` : "N/A"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
