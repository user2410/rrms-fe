import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { CheckCircle, Copy } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdMail } from "react-icons/io";
import * as z from "zod";


const formSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string(),
});

type FormValue = z.infer<typeof formSchema>;

type STAGE = "INPUT" | "PENDING" | "SUCCESS" | "ERROR";

export default function ApplicationInvitation({
  listings,
}: {
  listings: Listing[];
}) {
  const [stage, setStage] = useState<STAGE>("INPUT");
  const [res, setRes] = useState<string>("");
  const session = useSession();
  const form = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    }
  });

  useEffect(() => {
    setStage("INPUT");
  }, []);

  async function onSubmit(data: FormValue) {
    console.log(data);
    setStage("PENDING");
    try {
      const res = (await backendAPI.post(`/api/listings/listing/${listings[0].id}/application-link`, data, {
        headers: {
          Authorization: `Bearer ${session.data!.user.accessToken}`,
        }
      })).data;
      console.log(res.url);
      setRes(res.url);
      setStage("SUCCESS");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex flex-row items-center gap-2">
          <IoMdMail size={24} />
          Gửi link mời ứng tuyển
        </Button>
      </DialogTrigger>
        {stage === "INPUT" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gửi link mời ứng tuyển</DialogTitle>
              <DialogDescription>Gửi lịnk đến người bạn muốn thuê nhà trọ của mình</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="fullName"
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
                    control={form.control}
                    name="email"
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
                    control={form.control}
                    name="phone"
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
                <div className="w-full mt-4">
                  <Button type="submit" className="float-right">Gửi</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        )}
        {stage === "PENDING" && (
          <DialogContent className="px-4 py-6">
            <DialogHeader/>
            <div className="w-full flex flex-col items-center gap-3">
              <h3>Đang tạo link</h3>
              <Spinner/>
            </div>
          </DialogContent>
        )}
        {stage === "SUCCESS" && (
          <DialogContent className="px-4 py-6">
            <DialogHeader/>
            <div className="w-full flex flex-col items-center gap-3">
              <h3 className="font-semibold">Link đã được tạo thành công</h3>
              <CheckCircle className="h-4 w-4 text-green-600"/>
              <div className="flex flex-row gap-2">
                <Input value={res} onChange={() => {}} className="min-w-[40%]"/>
                <Button 
                  type="button" variant="outline"
                  onClick={() => navigator.clipboard.writeText(res)}
                >
                  <Copy className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
        {stage === "ERROR" && (
          <DialogContent className="px-4 py-6">
            <DialogHeader/>
            <div className="w-full flex flex-col items-center gap-3">
              <h3>Đã có lỗi xảy ra</h3>
              <DialogClose asChild><Button variant="outline">Quay lại</Button></DialogClose>
            </div>
          </DialogContent>
        )}
    </Dialog>
  );
};
