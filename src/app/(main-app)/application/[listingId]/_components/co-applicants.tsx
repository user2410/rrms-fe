"use client";

import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { format, sub } from "date-fns";
import { Fragment, forwardRef, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { FaBirthdayCake, FaBusinessTime } from "react-icons/fa";
import * as z from "zod";
import { ApplicationForm } from "./main_form";
import { Listing } from "@/models/listing";

const inputFormSchema = z.object({
  fullName: z.string(),
  dob: z.date(),
  job: z.string(),
  income: z.number().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
});

type InputForm = z.infer<typeof inputFormSchema>;

type InputFormProps = {
  title: string;
  description?: string;
  hideTriggerBtn?: boolean;
  submitBtnText: string;
  defaultValues?: InputForm;
  onSubmit: (value: InputForm) => void;
};
const InputForm = forwardRef<HTMLButtonElement, InputFormProps>(function Render({
  title, description, hideTriggerBtn = false, submitBtnText, 
  defaultValues, onSubmit,
}, triggerBtnRef) {
  const applicationForm = useFormContext<ApplicationForm>();
  const minorForm = useForm<InputForm>({
    resolver: zodResolver(inputFormSchema),
    defaultValues,
  });

  return (
    <Dialog onOpenChange={(open) => {
      console.log(defaultValues);
      minorForm.reset(defaultValues);
    }}>
      <DialogTrigger asChild>
        {hideTriggerBtn ? (
          <button type="button" ref={triggerBtnRef} hidden/>
        ) : (
          <Button type="button" ref={triggerBtnRef} variant="link">Thêm người thuê cùng</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md lg:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>
              {description}
            </DialogDescription>
          ) : null}
        </DialogHeader>
        <Form {...minorForm}>
          <form>
            <div className="py-4 space-y-3">
              <FormField
                name="fullName"
                control={minorForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dob"
                control={minorForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày tháng năm sinh</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value && format(field.value, "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (!e.currentTarget.value) return;
                          minorForm.setValue("dob", new Date(e.currentTarget.value));
                        }}
                        max={format(sub(new Date(), {years: 18}), "yyyy-MM-dd")}
                        className="w-full p-3"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  name="email"
                  control={minorForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone"
                  control={minorForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  name="job"
                  control={minorForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nghề nghiệp</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ví dụ: Nhân viên văn phòng, bác sỹ" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="income"
                  control={minorForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thu nhập (/tháng)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                name="description"
                control={minorForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả thêm</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Thông tin thêm về người thuê cùng (nơi làm việc, ,...)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" onClick={() => {
                  const data = minorForm.getValues();
                  console.log("submit", data);
                  onSubmit(data);
                }}>{submitBtnText}</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );

});


export default function CoApplicants({
  listing,
} : {
  listing: Listing;
}) {
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [editing, setEditing] = useState<number>(-1);

  const parentForm = useFormContext<ApplicationForm>();
  const { fields, append, remove } = useFieldArray({
    control: parentForm.control,
    name: "ao.coaps",
  });

  useEffect(() => {
    if(listing.numberOfResidents && addBtnRef.current) {
      if(fields.length >= listing.numberOfResidents) {
        addBtnRef.current.disabled = true;
      } else {
        addBtnRef.current.disabled = false;
      }
    }
  }, [fields]);

  return (
    <Fragment>
      <CardHeader>
        <CardTitle>Người thuê cùng</CardTitle>
        <CardDescription>Những người cùng thuê nhà với bạn trên 18 tuổi {listing.numberOfResidents && (`(tối đa ${listing.numberOfResidents} người)`)}.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {parentForm.watch("ao.coaps").map((field, index) => (
            <div key={index} className="border flex flex-row justify-between py-2">
              <div className="space-y-2 px-4">
                <div className="text-lg font-semibold">{field.fullName}</div>
                <div className="text-md font-normal flex flex-row items-center gap-2">
                  <FaBirthdayCake size={16} />
                  <span>{format(field.dob, "dd/MM/yyyy")} ({(new Date()).getFullYear() - field.dob.getFullYear()} tuổi)</span>
                </div>
                <div className="text-md font-normal flex flex-row items-center gap-2">
                  <FaBusinessTime size={16} />
                  <span>{field.job} - {field.income}đ/tháng</span>
                </div>
                <div className="text-sm font-light truncate">{field.description}</div>
              </div>
              <div className="flex flex-row">
                <Button
                  type="button" variant="link"
                  onClick={() => {
                    setEditing(index);
                    editBtnRef.current?.click();
                  }}
                >
                  Sửa
                </Button>
                <Button type="button" variant="link" className="text-red-600" onClick={() => remove(index)}>Xóa</Button>
              </div>
            </div>
          ))}
        </div>
        <InputForm
          ref={addBtnRef}
          title="Thêm người thuê cùng"
          description="Thêm người thuê cùng trên 18 tuổi sẽ sống tại đây."
          submitBtnText="Thêm"
          onSubmit={(value) => {
            console.log("add value", value);
            append(value);
          }}
        />
        <InputForm
          ref={editBtnRef}
          title="Sửa thông tin"
          submitBtnText="Lưu"
          hideTriggerBtn
          defaultValues={editing > -1 ? fields[editing] : undefined}
          onSubmit={(value) => {
            console.log("edit value", value, "at index", editing);
            parentForm.setValue(`ao.coaps.${editing}`, value);
          }}
        />
      </CardContent>
    </Fragment>
  );
}
