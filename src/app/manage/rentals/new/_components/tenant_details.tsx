import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { addMonths, format } from "date-fns";
import { useFormContext } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import CoApplicants from "./co-applicants";
import Minors from "./minors";
import Pets from "./pets";
import { useRef } from "react";
import { useDataCtx } from "../_context/data.context";

export default function TenantDetails() {
  const form = useFormContext();
  const {property} = useDataCtx();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const currentImage = form.watch('profileImage');

  const startDate = form.watch("startDate");

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold">Bên thuê</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Đối tượng thuê</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 gap-2">
          <FormField
            control={form.control}
            name="tenantType"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Đối tượng thuê</FormLabelRequired>
                <Select onValueChange={v => {
                  if (v === "ORGANIZATION") {
                    form.resetField("organizationName");
                    form.resetField("organizationHqAddress");
                    form.setValue("rentalIntention", "OFFICE");
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
          <FormField
            control={form.control}
            name="rentalIntention"
            render={({ field }) => (
              <FormItem>
                <FormLabelRequired>Mục đích thuê</FormLabelRequired>
                <Select 
                  defaultValue={field.value}
                  onValueChange={field.onChange} 
                >
                  <FormControl>
                    <SelectTrigger className="space-x-2">
                      <SelectValue placeholder="Chọn mục đích thuê trọ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {property.type !== "OFFICE" && (
                      <>
                        <SelectItem value="RESIDENCE">Để ở</SelectItem>
                        <SelectItem value="TENANCY">Nhà trọ</SelectItem>
                      </>
                    )}
                    <SelectItem value="BUSINESS">Kinh doanh</SelectItem>
                    <SelectItem value="OFFICE">Văn phòng</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          {form.watch("tenantType") === "ORGANIZATION" && (
            <>
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
                name="organizationHqAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Địa chỉ trụ sở</FormLabelRequired>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Ghi chú</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{form.watch("tenantType") === "INDIVIDUAL" ? "Người thuê" : "Người đại diện"}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row gap-3">
          <div className="flex-1 grid grid-cols-2 gap-3">
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
          </div>
          <FormField
            name="profileImage"
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
                        form.setValue('profileImage', {
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
