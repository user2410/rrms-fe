"use client";

import { useFormContext } from "react-hook-form";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { GiCutDiamond } from "react-icons/gi";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FaUser } from "react-icons/fa";
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
                { label: "Chủ nhà", desc: "Đăng tin với vai trò chủ nhà", value: "owner", icon: GiCutDiamond },
                { label: "Người quản lý", desc: "Người quản lý nhà cho thuê cùng chủ nhà",value: "manager", icon: FaUser },
                { label: "Môi giới", desc: "Người môi giới, đại lý đăng tin cho chủ nhà hoặc người quản lý", value: "broker", icon: BsFillBriefcaseFill },
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
