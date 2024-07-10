"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import * as Tabs from '@radix-ui/react-tabs';
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import LoginForm from "./login_form";
import RegisterForm from "./register_form";

export default function AuthModal() {
  const modalTriggerBtnRef = useRef<HTMLButtonElement>(null);

  function changeOpenModal() {
    modalTriggerBtnRef.current?.click();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button ref={modalTriggerBtnRef} type="button" variant="outline">Đăng nhập</Button>
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
              <Tabs.Root defaultValue="login" className="TabsRoot">
                <Tabs.List className="TabsList">
                  <Tabs.Trigger className="TabsTrigger" value="login">Đăng nhập</Tabs.Trigger>
                  <Tabs.Trigger className="TabsTrigger" value="register">Đăng kí</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content className="TabsContent" value="login">
                  <LoginForm changeOpenModal={changeOpenModal}/>
                </Tabs.Content>
                <Tabs.Content className="TabsContent" value="register">
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
