import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Reminder } from "@/models/reminder";
import { toISOStringWithTimezone } from "@/utils/time";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { addHours } from "date-fns";
import { Session } from "next-auth";
import { forwardRef } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useWSCtx } from "../../_context/ws.context";

const formSchema = z.object({
  title: z.string().nonempty(),
  note: z.string(),
  startAt: z.date(),
  location: z.string().nonempty(),
  endAt: z.date(),
});

type FormValues = z.infer<typeof formSchema>;
type CreateReminderDialogProps = {
  applicationData: ManagedApplication;
  sessionData: Session;
};

const CreateReminderDialog = forwardRef<HTMLButtonElement, CreateReminderDialogProps>(function Render(props, ref) {
  const { applicationData, sessionData } = props;
  const { conn } = useWSCtx();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      note: "",
      startAt: addHours(new Date(), 1),
      location: "",
      endAt: addHours(new Date(), 1),
    },
  });

  async function submitHandler(data: FormValues) {
    console.log("submit:", data);
    try {
      const res = (await backendAPI.post<Reminder>(`/api/applications/application/${applicationData.application.id}/reminders`, data, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data;
      conn?.send(JSON.stringify({
        type: "REMINDER_CREATE",
        payload: res,
      }));
      toast.success("Tạo lịch hẹn thành công");
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra khi tạo lịch hẹn");
    }
  }

  return (
    <Dialog onOpenChange={() => form.reset()}>
      <DialogTrigger>
        <Button ref={ref} variant="outline" className="w-full font-light uppercase">+ Tạo lịch hẹn</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitHandler)}>
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
                        min={addHours(new Date(), 1).toISOString().substring(0, 16)}
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
                <Button variant="outline" className="mr-2">Hủy</Button>
              </DialogClose>
              <Button type="submit">Tạo</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default CreateReminderDialog;
