import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, forwardRef, useRef, useState } from "react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import * as z from "zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { FaWeight } from "react-icons/fa";
import { Listing } from "@/models/listing";
import { FormValues } from "../page";

const inputFormSchema = z.object({
  type: z.string(),
  weight: z.number().optional(),
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
          <button type="button" ref={triggerBtnRef} hidden />
        ) : (
          <Button type="button" ref={triggerBtnRef} variant="link">Thêm thú nuôi</Button>
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
                        <SelectItem value="dog">Chó</SelectItem>
                        <SelectItem value="cat">Mèo</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="weight"
                control={minorForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cân nặng (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="Cân nặng của thú nuôi" onChange={(e) => field.onChange(e.currentTarget.valueAsNumber)} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={minorForm.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Mô tả thêm</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} placeholder="Thông tin thêm về thú nuôi (tình trạng tiêm chủng, dị ứng,...)" />
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


export default function Pets() {
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const editBtnRef = useRef<HTMLButtonElement>(null);

  const [editing, setEditing] = useState<number>(-1);

  const parentForm = useFormContext<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control: parentForm.control,
    name: "pets",
  });

  return (
    <Fragment>
      <CardHeader>
        <CardTitle className="text-lg">Thú nuôi</CardTitle>
        <CardDescription>Thông tin về thú nuôi (loại, tình trạng tiêm chủng).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {parentForm.watch("pets").map((field, index) => (
            <div key={index} className="border flex flex-row justify-between py-2">
              <div className="space-y-2 px-4">
                <div className="text-lg font-semibold">{field.type}</div>
                <div className="text-md font-normal flex flex-row items-center gap-2">
                  <FaWeight size={16} />
                  <span>{field.weight} kg</span>
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
          title="Thêm thú nuôi"
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
            parentForm.setValue(`pets.${editing}`, value);
          }}
        />
      </CardContent>
    </Fragment>
  );
}
