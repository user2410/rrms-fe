"use client";

import FormLabelWithInfo from "@/components/complex/label-with-info";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormLabelRequired, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { backendAPI } from "@/libs/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const registerFormSchema = z.object({
  firstName: z.string({ required_error: "Yêu cầu tên" }),
  lastName: z.string({ required_error: "Yêu cầu họ" }),
  email: z.string({ required_error: "Yêu cầu email" }).email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
  role: z.enum(["LANDLORD", "TENANT"]),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export default function RegisterForm({
  changeOpenModal,
}: {
  changeOpenModal: () => void;
}) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "TENANT",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setLoading(true);
    console.log(data);
    try {
      const res = await backendAPI.post("/api/auth/credential/register", data);
      console.log(res);
      toast.success("Registered successfully");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      form.reset();
      changeOpenModal();
    }
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <div className="w-full grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Tên</FormLabelRequired>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="John"
                        autoCapitalize="words"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabelRequired>Họ</FormLabelRequired>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Doe"
                        autoCapitalize="words"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabelRequired>Email</FormLabelRequired>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabelWithInfo
                    label="Mật khẩu"
                    info={(
                      <ul className="text-sm text-muted-foreground list-disc list-inside">
                        <li>Tối thiểu 8 kí tự</li>
                        <li>Chứa ít nhất 1 chữ cái và 1 số</li>
                        <li>Chứa ít nhất 1 ký tự đặc biệt</li>
                        <li>Chứa ít nhất 1 ký tự hoa và thường</li>
                      </ul>
                    )}
                  />
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                        {showPassword ? (
                          <Eye className="h-6 w-6" onClick={() => setShowPassword(v => !v)} />
                        ) : (
                          <EyeOff className="h-6 w-6" onClick={() => setShowPassword(v => !v)} />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === "LANDLORD"}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange("LANDLORD")
                          : field.onChange("TENANT");
                      }}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Tôi là chủ nhà cho thuê hoặc quản lý nhà
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Đăng kí
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Hoặc tiếp tục bằng
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="outline" type="button" disabled={isLoading} className="bg-black hover:bg-gray-900 text-white hover:text-white">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white hover:text-white">
          {isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" color="red" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button>
      </div>
    </div>
  );
}
