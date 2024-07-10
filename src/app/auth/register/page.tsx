"use client";

import RegisterForm from "@/app/(main-app)/_components/register_form";
import { Metadata } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

// export const metadata: Metadata = {
//   title: "Đăng ký",
// };


export default function RegisterPage() {
  const session = useSession();
  const navigation = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams?.get("redirect");

  if (session.status === "authenticated") {
    navigation.replace(redirect ? redirect : "/");
    return <p>Redirecting...</p>;
  }

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Chào mừng đến với RRMS
          </h1>
          <p className="text-sm text-muted-foreground">
            Đăng ký tài khoản mới
          </p>
        </div>
        <RegisterForm changeOpenModal={() => redirect ? navigation.push(redirect) : navigation.push("/")} />
        <p className="px-8 text-center text-sm text-muted-foreground">
          Khi chọn tiếp tục, bạn đồng ý với điều khoản {" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};
