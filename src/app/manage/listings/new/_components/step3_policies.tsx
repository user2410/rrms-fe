import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Fragment } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { ListingFormValues } from "../page";
import { rentalPolicies } from "@/models/listing";

export default function Step3Policies() {
  const form = useFormContext<ListingFormValues>();

  const { fields, append, remove } = useFieldArray<ListingFormValues>({
    control: form.control,
    name: "listing.policies",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quy định thuê nhà</CardTitle>
        <CardDescription>Nêu rõ các quy định đối với người thuê nhà</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-row items-center">
            <FormField
              control={form.control}
              name="listing.numberOfResidents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số người thuê tối đa</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-1">
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                      <Button
                        type="button"
                        onClick={() => form.setValue("listing.numberOfResidents", 0)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row items-center">
            <FormField
              control={form.control}
              name="listing.leaseTerm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời hạn thuê (tháng)</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-1">
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                      <Button
                        type="button"
                        onClick={() => form.setValue("listing.numberOfResidents", 0)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </FormControl>
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
        </div>
        <div className="grid grid-cols-6 gap-2">
        {fields.map((_, index) => (
          <Fragment key={index}>
            <div className="col-span-2 flex flex-col justify-center">
              <FormField
                control={form.control}
                name={`listing.policies.${index}.policyId`}
                render={({ field }) => (
                  <FormItem>
                    <Select 
                      onValueChange={(e) => field.onChange(parseInt(e, 10))} 
                      value={form.watch(`listing.policies.${index}.policyId`).toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Quy định" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {rentalPolicies.map((p) => (
                          <SelectItem
                            key={p.id}
                            // @ts-ignore
                            disabled={fields.map((f) => f.policyId).includes(p.id)}
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
          onClick={() => append({ policyId: 0, note: "" })}
        >
          Thêm quy định
        </Button>
      </CardContent>
    </Card>
  );
};
