import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useFormContext } from "react-hook-form";
import { useDataCtx } from "../_context/data.context";
import CoApplicants from "./co-applicants";
import Minors from "./minors";
import Pets from "./pets";
import { addMonths, format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

export default function TenantDetails() {
  const form = useFormContext();
  const { property } = useDataCtx();
  const startDate = form.watch("startDate");

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Bên thuê</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Đối tượng thuê</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <FormField
            control={form.control}
            name="tenantType"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabelRequired>Đối tượng thuê</FormLabelRequired>
                <Select onValueChange={v => {
                  if (v === "ORGANIZATION") {
                    form.resetField("organizationName");
                    form.resetField("organizationHqAddress");
                    form.resetField("organizationScale");
                  }
                  field.onChange(v);
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Cá nhân</SelectItem>
                    <SelectItem value="ORGANIZATION">Tổ chức</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.watch("tenantType") === "ORGANIZATION" && (
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Tên công ty / tổ chức</FormLabelRequired>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizationScale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quy mô</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="">
                          <SelectValue placeholder="Quy mô công ty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="501-1000">501-1000</SelectItem>
                        <SelectItem value="1000+">1000+</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="organizationHqAddress"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabelRequired>Địa chỉ trụ sở</FormLabelRequired>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{form.watch("tenantType") === "INDIVIDUAL" ? "Người thuê" : "Tổ chức"}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="tenantName"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabelRequired>Họ và tên</FormLabelRequired>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tenantEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Email</FormLabelRequired>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tenantPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Số điện thoại</FormLabelRequired>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        {form.watch("tenantType") === "INDIVIDUAL" && (
          <>
            <Separator />
            <CoApplicants />
            <Separator />
            <Minors />
            <Separator />
            <Pets />
          </>
        )}
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chuyển tới thuê</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="moveinDate"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Ngày chuyển tới thuê</FormLabelRequired>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value && format(field.value, "yyyy-MM-dd")}
                    onChange={(e) => {
                      if (!e.currentTarget.value) return;
                      field.onChange(new Date(e.currentTarget.value));
                    }}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="w-full p-3"
                  />
                </FormControl>
                <FormDescription>Ngày chuyển tới thuê thực tế</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Ngày bắt đầu thuê</FormLabelRequired>
                <FormControl>
                  <Input
                    type="date"
                    value={field.value && format(field.value, "yyyy-MM-dd")}
                    onChange={(e) => {
                      if (!e.currentTarget.value) return;
                      field.onChange(new Date(e.currentTarget.value));
                    }}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="w-full p-3"
                  />
                </FormControl>
                <FormDescription>Ngày bắt đầu thuê theo hợp đồng</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rentalPeriod"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Thời gian thuê (tháng)</FormLabelRequired>
                <FormControl>
                  <Input type="number" {...field} onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
                </FormControl>
                <FormDescription>Thời gian thuê theo hợp đồng {(startDate && field.value) && `(Hết hạn ${addMonths(startDate, field.value).toLocaleDateString("vi-VN")})`}</FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
