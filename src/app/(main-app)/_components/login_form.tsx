
"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import ForgetPasswordModal from "./forget-pass.modal";

const loginFormSchema = z.object({
  email: z.string({ required_error: "Yêu cầu email" }).email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
  // .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/),
  remember: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginForm({
  changeOpenModal,
} : {
  changeOpenModal: () => void;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    console.log(data);
    try {
      const cb = await signIn('credentials', {
        ...data,
        redirect: false
      });
      if (cb?.error) {
        console.error(cb.error);
        toast.error("Invalid credential");
      } else if (cb?.ok) {
        toast.success(`Logged in as ${data.email}!`);
        // modalTriggerBtnRef.current?.click();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      form.reset();
      changeOpenModal();
    }
  };

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={form.formState.isSubmitting}
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
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        disabled={form.formState.isSubmitting}
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
          </div>
          <div className="flex flex-row justify-between items-center">
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-slate-500 !m-0">Remember me</FormLabel>
                </FormItem>
              )}
            />
            <ForgetPasswordModal />
          </div>
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            {form.formState.isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Đăng nhập
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Hoặc đăng nhập bằng
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="outline" type="button" disabled={form.formState.isSubmitting} className="bg-black hover:bg-gray-900 text-white hover:text-white">
          {form.formState.isSubmitting ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          GitHub
        </Button>
        <Button variant="outline" type="button" disabled={form.formState.isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white hover:text-white">
          {form.formState.isSubmitting ? (
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


