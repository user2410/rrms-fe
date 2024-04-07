import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormLabelRequired } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { ContractBFormValues } from "./create_contract_b";
import { useDataCtx } from "../../_context/data.context";
import { Separator } from "@radix-ui/react-separator";
import clsx from "clsx";

export default function SideB() {
  const { rental } = useDataCtx();
  const form = useFormContext<ContractBFormValues>();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Bên thuê (Bên B) - {rental.tenantType === "ORGANIZATION" ? "Tổ chức" : "Cá nhân"}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-6 gap-3">
          {rental.tenantType === "ORGANIZATION" && (
            <div className="col-span-6">
              <CardHeader className="p-0">
                <CardTitle className="text-lg">Thông tin tổ chức</CardTitle>
              </CardHeader>
              <CardContent className="p-0 grid grid-cols-6 gap-3">
                <FormField
                  control={form.control}
                  name="bOrganizationName"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabelRequired>Tên tổ chức</FormLabelRequired>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bOrganizationHqAddress"
                  render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabelRequired>Trụ sở chính</FormLabelRequired>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bOrganizationCode"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabelRequired>Mã số doanh nghiệp</FormLabelRequired>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bOrganizationCodeIssuedAt"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabelRequired>Cấp ngày</FormLabelRequired>
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
                  name="bOrganizationCodeIssuedBy"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabelRequired>Nơi cấp</FormLabelRequired>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Separator />
              </CardFooter>
              <CardTitle className="text-lg">Người đại diện</CardTitle>
            </div>
          )}
          <FormField
            control={form.control}
            name="bFullName"
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
            name="bDob"
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
            name="bAddress"
            render={({ field }) => (
              <FormItem className={clsx("col-span-3", rental.tenantType === "ORGANIZATION" && "col-span-6")}>
                <FormLabelRequired>Địa chỉ</FormLabelRequired>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {rental.tenantType !== "ORGANIZATION" && (
            <FormField
              control={form.control}
              name="bHouseholdRegistration"
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabelRequired>Hộ khẩu</FormLabelRequired>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="bIdentity"
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
            name="bIdentityIssuedBy"
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
            name="bIdentityIssuedAt"
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
                    max={format(new Date(), "yyyy-MM-dd")}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bTaxCode"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabelRequired>Mã số thuế</FormLabelRequired>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bBankAccount"
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
            name="bBank"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Ngân hàng</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
