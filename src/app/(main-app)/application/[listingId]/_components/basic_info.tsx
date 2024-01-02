import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import { ApplicationForm } from "./main_form";

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
            name="ao.fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Họ và tên</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
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
                <FormLabel className="block text-center">Ảnh chân dung</FormLabel>
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
