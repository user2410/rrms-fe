import { useFieldArray, useFormContext } from "react-hook-form";
import { ContractAFormValues } from "./create_contract_a";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SideA() {
  const form = useFormContext<ContractAFormValues>();
  const { fields: aCerts, append: aCertAppend, remove: aCertRemove } = useFieldArray<ContractAFormValues>({
    control: form.control,
    name: "sides.aDocuments",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bên cho thuê (Bên A)</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-6 gap-3">
        <FormField
          control={form.control}
          name="sides.aFullName"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabelRequired>Họ và tên</FormLabelRequired>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aDob"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabelRequired>Ngày tháng năm sinh</FormLabelRequired>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value && format(field.value, "yyyy-MM-dd")}
                  onChange={(e) => {
                    if (!e.currentTarget.value) return;
                    field.onChange(new Date(e.currentTarget.value));
                  }}
                  max={format(new Date(), "yyyy-MM-dd")}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aAddress"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabelRequired>Địa chỉ</FormLabelRequired>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aHouseholdRegistration"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabelRequired>Hộ khẩu</FormLabelRequired>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aIdentity"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabelRequired>CMND/CCCD số</FormLabelRequired>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aIdentityIssuedBy"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabelRequired>Nơi cấp</FormLabelRequired>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aIdentityIssuedAt"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabelRequired>Ngày cấp</FormLabelRequired>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  value={field.value && format(field.value, "yyyy-MM-dd")}
                  onChange={(e) => {
                    if (!e.currentTarget.value) return;
                    field.onChange(new Date(e.currentTarget.value));
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aBankAccount"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Số tài khoản</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aBank"
          render={({ field }) => (
            <FormItem className="col-span-3">
              <FormLabel>Ngân hàng</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sides.aRegistrationNumber"
          render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabelRequired>Giấy chứng nhận quyền sở hữu nhà số</FormLabelRequired>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="col-span-6 space-y-3">
          <Label className="block">Các chứng từ sở hữu và tham khảo về nhà ở đã được cơ quan có thẩm quyền cấp cho Bên A:</Label>
          {aCerts.map((cert, index) => (
            <div key={cert.id} className="flex flex-row items-center space-x-3">
              <Input {...form.register(`sides.aDocuments.${index}.cert`)} />
              <Button type="button" onClick={() => aCertRemove(index)}>Xóa</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => aCertAppend({ cert: "" })}>Thêm chứng từ</Button>
        </div>
      </CardContent>
    </Card>
  );
};
