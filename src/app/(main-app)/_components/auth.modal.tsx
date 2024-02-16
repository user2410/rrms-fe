"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Tabs from '@radix-ui/react-tabs';
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import styles from "../_styles/page.module.css";
import clsx from "clsx";
import ForgetPasswordModal from "./forget-pass.modal";
import FormLabelWithInfo from "@/components/complex/label-with-info";
import { backendAPI } from "@/libs/axios";

export default function AuthModal() {
  const modalTriggerBtnRef = useRef<HTMLButtonElement>(null);

  function changeOpenModal() {
    modalTriggerBtnRef.current?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button ref={modalTriggerBtnRef} type="button" variant="outline">Sign in</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="relative hidden lg:block h-full bg-muted p-10 dark:border-r">
            <Image
              src="/img/login.png"
              fill
              objectFit="cover"
              alt="Authentication"
              className="inset-0"
            />
          </div>
          <div className="col-span-2 lg:col-span-1 lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center gap-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Chào mừng đến với RRMS
              </h1>
              <Tabs.Root defaultValue="login" className={styles.TabsRoot}>
                <Tabs.List className={styles.TabsList}>
                  <Tabs.Trigger className={clsx(styles.TabsTrigger, "!focus:ring-0")} value="login">Đăng nhập</Tabs.Trigger>
                  <Tabs.Trigger className={clsx(styles.TabsTrigger, "!focus:ring-0")} value="register">Đăng kí</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className={styles.TabsContent} value="login">
                  <LoginForm changeOpenModal={changeOpenModal}/>
                </Tabs.Content>
                <Tabs.Content className={styles.TabsContent} value="register">
                  <RegisterForm changeOpenModal={changeOpenModal}/>
                </Tabs.Content>
              </Tabs.Root>
              <p className="px-8 text-center text-sm text-muted-foreground">
                Khi chọn tiếp tục, bạn đồng ý với điều khoản {" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" and "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>{" "}
                của RRMS.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const loginFormSchema = z.object({
  email: z.string({ required_error: "Yêu cầu email" }).email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
  // .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{8,})$/),
  remember: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

function LoginForm({
  changeOpenModal,
} : {
  changeOpenModal: () => void;
}) {
  const [isLoading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
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
                  <FormLabel>Mật khẩu</FormLabel>
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
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading && (
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

const registerFormSchema = z.object({
  firstName: z.string({ required_error: "Yêu cầu tên" }),
  lastName: z.string({ required_error: "Yêu cầu họ" }),
  email: z.string({ required_error: "Yêu cầu email" }).email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

function RegisterForm({
  changeOpenModal,
} : {
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
                    <FormLabel>Tên</FormLabel>
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
                    <FormLabel>Họ</FormLabel>
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
                  <FormLabel>Email</FormLabel>
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
