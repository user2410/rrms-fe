import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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

  const currentImage = form.watch('ao.profileImage');

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
                <FormLabel>Đối tượng thuê</FormLabel>
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
                    <SelectItem value="INDIVIDUAL">Cá nhân</SelectItem>
                    <SelectItem value="ORGANIZATION">Tổ chức</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage/>
              </FormItem>
            )}
          />
          {form.watch("ao.tenantType") === "ORGANIZATION" && (
            <>
              <FormField
                control={form.control}
                name="ao.organizationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên công ty / tổ chức</FormLabel>
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
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ao.organizationHqAddress"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Địa chỉ trụ sở</FormLabel>
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
                <FormLabel>Họ và tên {form.watch("ao.tenantType") === "ORGANIZATION" && "người đại diện"}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          {form.watch("ao.tenantType") === "INDIVIDUAL" && (
            <FormField
              name="ao.dob"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Ngày tháng năm sinh</FormLabel><br />
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value && format(field.value, "yyyy-MM-dd")}
                      onChange={(e) => {
                        if (!e.currentTarget.value) return;
                        field.onChange(new Date(e.currentTarget.value));
                      }}
                      max={format(new Date(), "yyyy-MM-dd")}
                      className="w-full p-3"
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
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Số điện thoại</FormLabel>
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
                <FormLabel className="block text-center">Ảnh đại diện</FormLabel>
                <input
                  ref={inputFileRef} type="file" accept="image/*" hidden
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (currentImage) URL.revokeObjectURL(currentImage.url);
                      const { name, size, type } = file;
                      console.log('new file', { name, size, type });
                      form.setValue('ao.profileImage', {
                        name, size, type,
                        url: URL.createObjectURL(file),
                      });
                    }
                  }} />
                <button
                  type="button"
                  className={
                    currentImage
                      ? "w-56 aspect-[3/4] relative"
                      : "rounded-full bg-slate-100 w-56 h-56 flex flex-row justify-center items-center"
                  }
                  onClick={() => { inputFileRef.current?.click(); }}
                >
                  {currentImage ? (
                    <img
                      className="absolute inset-0 object-cover w-full h-full hover:opacity-25"
                      src={currentImage.url}
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
