import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { rentalPolicies } from "@/models/listing";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { ListingFormValues } from "./page";

export default function Step3() {
  const form = useFormContext<ListingFormValues>();

  const { fields, append, remove } = useFieldArray<ListingFormValues>({
    name: "listing.policies",
    control: form.control,
  });

  return (
    <div className="space-y-4">
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
                <FormLabel>Mô tả <span className="ml-1 text-red-600">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    maxLength={3000}
                    className="resize-none"
                  />
                </FormControl>
                <FormDescription>Tối thiểu 30 ký tự, tối đa 3.000 ký tự</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mức giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="listing.priceNegotiable"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Giá cho thuê hàng tháng (vnđ)<span className="ml-1 text-red-600">*</span>
                  </FormLabel>
                  <FormField
                    control={form.control}
                    name="listing.price"
                    render={({ field: field2 }) => (
                      <FormItem className={form.watch("listing.priceNegotiable") ? "hidden" : ""}>
                        <FormControl>
                          <Input
                            type="number"
                            {...field2}
                            onChange={(e) => field2.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <FormLabel className="text-base">
                    Thỏa thuận
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                        if (e) {
                          form.setValue("listing.price", 0);
                        } else {
                          form.resetField("listing.price");
                        }
                      }}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="listing.securityDeposit"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Tiền cọc</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormDescription>Tiền đặt cọc đảm bảo việc thực hiện hợp đồng</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quy định thuê nhà</CardTitle>
          <CardDescription>Nêu rõ các quy định đối với người thuê nhà</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3 flex items-center">
              <FormField
                control={form.control}
                name="listing.numberOfResidents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số người thuê tối đa</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3 flex items-center">
              <FormField
                control={form.control}
                name="listing.leaseTerm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời hạn thuê</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormDescription>Thời hạn thuê tối thiểu (tháng)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-6 flex flex-col justify-center">
              <FormField
                control={form.control}
                name="listing.petsAllowed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Cho phép nuôi thú cưng
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {fields.map((policy, index) => (
              <Fragment key={index}>
                <div className="col-span-2 flex flex-col justify-center">
                  <FormField
                    control={form.control}
                    name={`listing.policies.${index}.policyId`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} value={form.watch(`listing.policies.${index}.policyId`)}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Quy định"/>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rentalPolicies.map((p) => (
                              <SelectItem
                                key={p.id}
                                disabled={fields.map((f) => f.policyId).includes(p.id.toString())}
                                value={p.id.toString()}
                              >
                                {p.text}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-4 flex items-center gap-2">
                  <FormField
                    control={form.control}
                    name={`listing.policies.${index}.note`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Textarea
                            placeholder="Quy định"
                            className="resize-none"
                            {...field}
                            value={form.watch(`listing.policies.${index}.note`)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      console.log("index", index);
                      console.log("fields", fields);
                      console.log("item", fields[index]);
                      remove(index);
                    }}
                  >
                    <IoClose size={24} />
                  </Button>
                </div>
              </Fragment>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => append({ policyId: "0", note: "" })}
          >
            Thêm quy định
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
