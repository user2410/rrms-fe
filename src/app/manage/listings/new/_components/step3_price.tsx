import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import { ListingFormValues } from "../page";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Step3Price() {
  const [hasDeposit, setHasDeposit] = useState(false);

  const form = useFormContext<ListingFormValues>();
  const selectedUnitIds = form.getValues("units");
  const units = form.getValues("propertyData.units");
  const selectedUnits = units.filter(u => selectedUnitIds.find(_u => _u.unitId === u.id));

  if (units.length === 1) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Giá thuê</CardTitle>
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
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label className="text-base"> Tiền cọc (vnđ) </Label>
              <FormField
                control={form.control}
                name="listing.securityDeposit"
                render={({ field: field2 }) => (
                  <FormItem className={hasDeposit ? "" : "hidden"}>
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
            <Switch
              checked={hasDeposit}
              onCheckedChange={(e) => {
                setHasDeposit(e);
                !e ? form.setValue("listing.securityDeposit", 0) : null;
              }}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Giá thuê</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phòng / căn hộ</TableHead>
              <TableHead>Giá thuê một tháng (đ)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedUnits.map((unit, index) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.name}</TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`units.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            defaultValue={field.value}
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
