"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Listing } from "@/models/listing";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { MdLocalPhone, MdOutlineEmail } from "react-icons/md";
import * as z from "zod";

const ContactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  moveinDate: z.date(),
  message: z.string(),
});

type ContactFormValues = z.infer<typeof ContactFormSchema>;

const defaultValues: Partial<ContactFormValues> = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

const FormBtn = ({
  variant = "default",
  className,
  icon,
  text,
} : {
  variant?: ButtonProps["variant"];
  className?: string;
  icon?: React.ReactNode;
  text: string;
}) => (
  <Button variant={variant} className={clsx(
      "flex justify-center items-center w-full gap-2",
      className
    )}>
    {icon}
    <span className="">{text}</span>
  </Button>
);

export default function ContactForm({listing} : {listing: Listing}) {
  const router = useRouter();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues,
  });

  const handleFormSubmit = (values: ContactFormValues) => {
    console.log(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liên hệ</CardTitle>
        <h1></h1>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form 
            className="space-y-3"
            onSubmit={form.handleSubmit(handleFormSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (<Input placeholder="Họ và tên *" {...field} />)}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (<Input placeholder="Email *" {...field} />)}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (<Input placeholder="Số điện thoại *" {...field} />)}
            />
            <FormField
              control={form.control}
              name="moveinDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={clsx(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Ngày chuyển tới thuê</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (<Textarea placeholder="Xin chào, tôi muốn biết thêm về" rows={3} {...field} />)}
            />
          </form>
        </Form>
        <div className="space-y-2">
          <FormBtn variant="default" text="Email" icon={(<MdOutlineEmail size={16} color="white"/>)} />
          <FormBtn variant="ghost" text={listing.phone} icon={(<MdLocalPhone size={16} color="green"/>)} />
          <FormBtn 
            variant="outline" 
            text="Chat qua Zalo" 
            icon={(<div className="w-6 h-6 relative">
              <Image src="/img/zalo_icon.png" alt="zalo icon" fill/>
            </div>)} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
