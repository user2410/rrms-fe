"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminPage() {
  const router = useRouter();
  const session = useSession();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  if (session.status === "authenticated") {
    if (session.data.user.user.role === "ADMIN") {
      router.replace("/admin/dashboard/properties/verification");
    } else {
      router.replace("/");
    }
    return (
      <>...Navigating</>
    );
  }

  async function handleSubmit(values: FormValues) {
    console.log(values);
    try {
      const cb = await signIn('credentials', {
        ...values,
        admin: true,
        redirect: false,
        accessToken: session.data?.user.accessToken,
      });
      if (cb?.error) {
        console.error(cb.error);
        toast.error("Invalid credential");
      } else if (cb?.ok) {
        toast.success(`Logged in as ${values.email}!`);
        router.replace("/admin/dashboard/properties/verification");
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      form.reset();
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <div className="relative w-8 h-8 mr-2">
            <Image
              src="/logo.png"
              alt="logo"
              fill
              objectFit="cover"
            />
          </div>
          <span className="text-2xl font-semibold">RRMS</span>
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng nhập tài khoản quản trị
            </h1>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Email" />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Đăng nhập</Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
