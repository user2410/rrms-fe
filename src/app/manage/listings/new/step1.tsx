"use client";

import { useFormContext } from "react-hook-form";
import { BsFillBuildingsFill, BsFillBriefcaseFill } from "react-icons/bs";
import { GiCutDiamond } from "react-icons/gi";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { ListingFormValues } from "./page";

export default function Step1() {
  const form = useFormContext<ListingFormValues>();

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="contact.contactType"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel>Đăng tin với vai trò <span className="ml-1 text-red-600">*</span></FormLabel>
            <FormMessage />
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid w-full grid-cols-3 gap-8 pt-2"
            >
              {[
                { label: "Chủ nhà", desc: "Đăng tin với vai trò chủ nhà, cho thuê với giá tốt nhất", value: "owner", icon: GiCutDiamond },
                { label: "Môi giới", desc: "Kiếm hoa hồng cao nhất bằng cách niêm yết tài sản của khách hàng của bạn ở mức giá tốt nhất.", value: "broker", icon: BsFillBriefcaseFill },
                { label: "Nhà thầu", desc: "Đăng tin với vai trò nhà thầu, đăng tin dự án của bạn và đạt được phạm vi tiếp cận cao nhất.", value: "builder", icon: BsFillBuildingsFill },
              ].map((item, index) => (
                <FormItem key={index}>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary block h-full">
                    <FormControl>
                      <RadioGroupItem value={item.value} className="sr-only" />
                    </FormControl>
                    <div className="h-full rounded-md border-2 border-muted p-4 hover:border-accent flex flex-col items-center gap-2">
                      <item.icon size={40} />
                      <h3 className="text-foreground font-medium">{item.label}</h3>
                      <p className="text-muted-foreground text-sm text-center">{item.desc}</p>
                    </div>
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="contact.fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Họ và tên <span className="ml-1 text-red-600">*</span> </FormLabel>
            <FormControl>
              <Input {...field} disabled/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name="contact.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email <span className="ml-1 text-red-600">*</span> </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số điện thoại <span className="ml-1 text-red-600">*</span> </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

    </div>
  );
}
