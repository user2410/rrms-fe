import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { forwardRef, useRef, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { FaCar, FaQuestionCircle } from "react-icons/fa";
import { GrBike } from "react-icons/gr";
import { RiMotorbikeFill } from "react-icons/ri";
import * as z from "zod";
import { ApplicationForm } from "./main_form";

const inputFormSchema = z.object({
  type: z.enum(["car", "motorbike", "bicycle", "other"]),
  model: z.string().optional(),
  code: z.string(),
});

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
          <button type="button" ref={triggerBtnRef} hidden />
        ) : (
          <Button type="button" ref={triggerBtnRef} variant="link">Thêm phương tiện</Button>
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
            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="type"
                control={minorForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="car">Ô tô</SelectItem>
                        <SelectItem value="motorbike">Xe máy</SelectItem>
                        <SelectItem value="bicycle">Xe đạp</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="model"
                control={minorForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên xe</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="code"
                control={minorForm.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Biển số xe</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sm:justify-start mt-4">
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

type InputForm = z.infer<typeof inputFormSchema>;

export default function CoApplicants() {
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [editing, setEditing] = useState<number>(-1);

  const parentForm = useFormContext<ApplicationForm>();
  const { fields, append, remove } = useFieldArray({
    control: parentForm.control,
    name: "yd.vehicles",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phương tiện di chuyển</CardTitle>
        <CardDescription>Tìm nơi đỗ xe thích hợp.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {parentForm.watch("yd.vehicles").map((field, index) => (
            <div key={index} className="border flex flex-row justify-between py-2">
              <div className="space-y-2 px-4">
                {field.type === "car" ? (
                  <div className="flex flex-row items-center gap-2">
                    <FaCar size={16} />
                    <span className="text-lg font-semibold">Ô tô</span>
                  </div>
                ) : field.type === "motorbike" ? (
                  <div className="flex flex-row items-center gap-2">
                    <RiMotorbikeFill size={16} />
                    <span className="text-lg font-semibold">Xe máy</span>
                  </div>
                ) : field.type === "bicycle" ? (
                  <div className="flex flex-row items-center gap-2">
                    <GrBike size={16} />
                    <span className="text-lg font-semibold">Xe đạp</span>
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-2">
                    <FaQuestionCircle size={16} />
                    <span className="text-lg font-semibold">Khác</span>
                  </div>
                )}
                {field.model && (<div className="font-normal text-md">{field.model}</div>)}
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
          title="Thêm phương tiện"
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
            parentForm.setValue(`yd.vehicles.${editing}`, value);
          }}
        />
      </CardContent>
    </Card>
  );
}
