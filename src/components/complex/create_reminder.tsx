import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReminderCtx } from "@/context/reminder.context";
import { backendAPI } from "@/libs/axios";
import { Reminder } from "@/models/reminder";
import { toISOStringWithTimezone } from "@/utils/time";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { addHours } from "date-fns";
import { Session } from "next-auth";
import { forwardRef, useRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().nonempty(),
  note: z.string(),
  startAt: z.date(),
  location: z.string().nonempty(),
  endAt: z.date(),
  priority: z.number().int().min(0).max(2),
  recurrenceMode: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"])
});

export type FormValues = z.infer<typeof formSchema>;

type CreateReminderDialogProps = {
  triggerBtn: React.ReactNode;
  sessionData: Session;
  onCreate?: (reminder: Reminder) => void;
};

export default function CreateReminderDialog(props: CreateReminderDialogProps){
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const {addReminder} = useReminderCtx();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      note: "",
      startAt: addHours(new Date(), 1),
      location: "",
      endAt: addHours(new Date(), 1),
      recurrenceMode: "NONE",
      priority: 0,
    },
  });

  async function handleCreateReminder(values: FormValues) {
    try {
      const reminder = (await backendAPI.post<Reminder>("/api/reminders/", values, {
        headers: {
          Authorization: `Bearer ${props.sessionData.user.accessToken}`,
        },
      })).data;
      addReminder(reminder);
      if(props.onCreate) {
        props.onCreate(reminder);
      }
      toast.success("Đã tạo lịch hẹn");
    } catch(err) {
      console.error("error creating reminder", err);
      toast.error("Đã có lỗi xảy ra");
    }
  }

  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger asChild>
        {props.triggerBtn}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e) => {
            form.handleSubmit(handleCreateReminder)(e);
            closeBtnRef.current?.click();
          }}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="VD: Hẹn xem nhà trực tiếp" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa điểm</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-row items-start gap-2">
              <FormField
                control={form.control}
                name="startAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bắt đầu</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        value={field.value ? toISOStringWithTimezone(field.value).substring(0, 16) : undefined}
                        onChange={(e) => {
                          console.log("datetime value:", e.target.value);
                          form.setValue("startAt", new Date(e.target.value));
                        }}
                        min={addHours(new Date(), 1).toISOString().substring(0, 16)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kết thúc</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        value={field.value ? toISOStringWithTimezone(field.value).substring(0, 16) : undefined}
                        onChange={(e) => {
                          console.log("datetime value:", e.target.value);
                          form.setValue("endAt", new Date(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ghi chú</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="w-full flex flex-row items-center justify-end mt-4">
              <DialogClose asChild>
                <Button ref={closeBtnRef} variant="outline" className="mr-2">Hủy</Button>
              </DialogClose>
              <Button type="submit">Tạo</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
