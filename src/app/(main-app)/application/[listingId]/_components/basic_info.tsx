import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { ApplicationForm } from "./main_form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BasicInfo() {
  const form = useFormContext<ApplicationForm>();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const tenantType = form.watch("ao.tenantType");
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-row justify-between gap-4">
        <div className="grid grid-cols-2 gap-3 flex-1">
          <FormField
            control={form.control}
            name="ao.tenantType"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabelRequired>Đối tượng thuê</FormLabelRequired>
                <Select onValueChange={v => {
                  if (v === "ORGANIZATION") {
                    form.setValue("ao.rentalIntention", "OFFICE");
                  } else {
                    form.resetField("ao.organizationName");
                    form.resetField("ao.organizationHqAddress");
                    form.resetField("ao.organizationScale");
                  }
                  field.onChange(v);
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {form.getValues("ld.property.type") !== "OFFICE" && (
                      <>
                        <SelectItem value="INDIVIDUAL">Cá nhân</SelectItem>
                        <SelectItem value="FAMILY">Hộ gia đình</SelectItem>
                      </>
                    )}
                    {form.getValues("ld.property.type") === "OFFICE" && (
                      <SelectItem value="ORGANIZATION">Tổ chức</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            )}
          />
          {tenantType === "ORGANIZATION" && (
            <>
              <FormField
                control={form.control}
                name="ao.organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Tên công ty / tổ chức</FormLabelRequired>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ao.organizationScale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Quy mô</FormLabelRequired>
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
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ao.organizationHqAddress"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabelRequired>Địa chỉ trụ sở</FormLabelRequired>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            name="ao.fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabelRequired>Họ và tên {tenantType === "ORGANIZATION" && "người đại diện"}</FormLabelRequired>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {tenantType === "INDIVIDUAL" && (
            <FormField
              name="ao.dob"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabelRequired>Ngày tháng năm sinh</FormLabelRequired>
                  <FormControl>
                    <Input
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
          )}
          <FormField
            name="ao.email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Email</FormLabelRequired>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="ao.phone"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Số điện thoại</FormLabelRequired>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="ao.profileImage"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="space-y-2">
                <FormLabelRequired className="block text-center">Ảnh đại diện</FormLabelRequired>
                <input
                  ref={inputFileRef} type="file" accept="image/*" hidden
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (field.value) URL.revokeObjectURL(field.value.url);
                      const { name, size, type } = file;
                      console.log('new file', { name, size, type });
                      field.onChange({
                        name, size, type,
                        url: URL.createObjectURL(file),
                      });
                    }
                  }} />
                <button
                  type="button"
                  className={
                    field.value
                      ? "w-56 aspect-[3/4] relative"
                      : "rounded-full bg-slate-100 w-56 h-56 flex flex-row justify-center items-center"
                  }
                  onClick={() => { inputFileRef.current?.click(); }}
                >
                  {field.value ? (
                    <img
                      className="absolute inset-0 object-cover w-full h-full hover:opacity-25"
                      src={field.value.url}
                      alt="profile"
                    />
                  ) : (
                    <FaCamera size={48} color="black" />
                  )}
                </button>
              </div>
              <FormMessage className="text-center" />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};
