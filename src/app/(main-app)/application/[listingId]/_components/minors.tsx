import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { Fragment, forwardRef, useRef, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { FaBirthdayCake } from "react-icons/fa";
import * as z from "zod";
import { ApplicationForm } from "./main_form";

const inputFormSchema = z.object({
  fullName: z.string(),
  dob: z.date(),
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
          <Button type="button" ref={triggerBtnRef} variant="link">Thêm trẻ vị thành niên</Button>
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
                      <FormItem className="grid grid-cols-4 items-center gap-2">
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl className="col-span-3">
                          <Input {...field} placeholder="Nguyen Van A" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="dob"
                    control={minorForm.control}
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-2">
                        <FormLabel>Sinh nhật</FormLabel>
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
                    name="description"
                    control={minorForm.control}
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-4 items-center gap-2">
                        <FormLabel>Mô tả thêm</FormLabel>
                        <FormControl className="col-span-3">
                          <Textarea {...field} rows={3} placeholder="Thông tin thêm về trẻ (trường học của trẻ, tình trạng sức khỏe, dị ứng,...)" />
                        </FormControl>
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


export default function Minors() {
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [editing, setEditing] = useState<number>(-1);

  const parentForm = useFormContext<ApplicationForm>();
  const { fields, append, remove } = useFieldArray({
    control: parentForm.control,
    name: "ao.minors",
  });

  return (
    <Fragment>
      <CardHeader>
        <CardTitle>Trẻ vị thành niên</CardTitle>
        <CardDescription>Thêm trẻ vị thành niên dưới 18 tuổi sẽ sống tại đây.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {parentForm.watch("ao.minors").map((field, index) => (
            <div key={index} className="border flex flex-row justify-between py-2">
            <div className="space-y-2 px-4">
              <div className="text-lg font-semibold">{field.fullName}</div>
              <div className="text-md font-normal flex flex-row items-center gap-2">
                <FaBirthdayCake size={16} />
                <span>{format(field.dob, "dd/MM/yyyy")} ({(new Date()).getFullYear() - field.dob.getFullYear()} tuổi)</span>
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
            parentForm.setValue(`ao.minors.${editing}`, value);
          }}
        />
      </CardContent>
    </Fragment>
  );
}
