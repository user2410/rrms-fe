"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Listing } from "@/models/listing";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import UnitsList from "./units";
import { ListingDetail } from "../page";

const ContactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  message: z.string(),
});

type ContactFormValues = z.infer<typeof ContactFormSchema>;

const defaultValues: Partial<ContactFormValues> = {
  name: "",
  email: "",
  phone: "",
  message: "",
};

export default function ContactForm({
  listingDetail,
}: {
  listingDetail: ListingDetail;
}) {
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
        <CardTitle className="text-xl">Yêu cầu xem nhà</CardTitle>
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
              render={({ field }) => (<Input autoComplete="off" placeholder="Họ và tên *" {...field} />)}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (<Input autoComplete="off" placeholder="Email *" {...field} />)}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (<Input autoComplete="off" placeholder="Số điện thoại *" {...field} />)}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (<Textarea placeholder="Xin chào, tôi muốn biết thêm về" rows={3} {...field} />)}
            />
            <div className="my-3">
              <Button type="submit" className="w-full">Gửi yêu cầu</Button>
            </div>
          </form>
        </Form>
        <Separator />
        <div className="text-xl">Hoặc bạn có thể</div>
        <div className="w-full flex flex-row gap-2">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" className="flex-1">Hỏi về nhà cho thuê này</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Hỏi về nhà cho thuê</DialogTitle>
              </DialogHeader>
              <EnquiryForm />
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>
              <Button variant="outline" className="flex-1">Ứng tuyển thuê nhà</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
              <DialogHeader />
              <UnitsList listingDetail={listingDetail} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function EnquiryForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues,
  });

  const handleFormSubmit = (values: ContactFormValues) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        className="space-y-3"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (<Input autoComplete="off" placeholder="Họ và tên *" {...field} />)}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (<Input autoComplete="off" placeholder="Email *" {...field} />)}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (<Input autoComplete="off" placeholder="Số điện thoại *" {...field} />)}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (<Textarea placeholder="VD: Tôi có được phép nuôi chó không" rows={3} {...field} />)}
        />
        <div className="my-3">
          <Button type="submit" className="w-full">Gửi câu hỏi</Button>
        </div>
      </form>
    </Form>
  );
}
