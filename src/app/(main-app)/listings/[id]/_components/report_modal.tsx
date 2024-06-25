"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  problems: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "Bạn cần chọn ít nhất 1 vấn đề.",
  }),
  feedback: z.string().optional(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string().min(10),
});

type FormValues = z.infer<typeof formSchema>;

const problems = [
  {
    id: "address",
    label: "Địa chỉ của nhà cho thuê",
  },
  {
    id: "media",
    label: "Ảnh",
  },
  {
    id: "duplication",
    label: "Trùng với tin đăng khác",
  },
  {
    id: "unreachable",
    label: "Không liên lạc được",
  },
  {
    id: "unreal",
    label: "Tin không có thật",
  },
];

export default function ReportModal({
  listingId,
}: {
  listingId: string;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function handleSubmit(values: FormValues) {
    console.log("submit:" , values);
    toast.success("Chức năng đang được phát triển.");
  }

  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" type="button">
                <TriangleAlert className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Báo cáo tin đăng</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Báo cáo tin đăng có thông tin không đúng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-2">
            <FormField
              control={form.control}
              name="problems"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base">Vấn đề của tin đăng</FormLabel>
                  {problems.map((item) => (
                    <FormField
                      key={item.id}
                      control={form.control}
                      name="problems"
                      render={({ field }) => (
                        <FormItem
                          key={item.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.id)}
                              onCheckedChange={(checked) => (checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                  field.value?.filter(
                                    (value) => value !== item.id
                                  )
                                )
                              )}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phản hồi khác</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Label className="font-semibold">Thông tin của bạn</Label>
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Họ và tên" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Email *" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Số điện thoại *" />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Hủy</Button>
              </DialogClose>
              <Button type="submit">Gửi</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
