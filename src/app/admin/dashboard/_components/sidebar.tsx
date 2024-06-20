"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, userRoleName } from "@/models/user";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import toast from "react-hot-toast";
import { BsBuildingFillAdd, BsFillBuildingsFill } from "react-icons/bs";
import { FaFile, FaFileAlt, FaFileContract, FaHandHolding, FaMoneyBill, FaUser } from "react-icons/fa";
import { FiLifeBuoy } from "react-icons/fi";
import { Home, ShieldCheck, Users } from "lucide-react";

const ICON_SIZE = 16;

export default function Sidebar() {
  const { data: session } = useSession();
  const userData = session?.user.user as User | undefined;

  const handleSignout = async () => {
    try {
      await signOut({
        callbackUrl: '/',
      });
      toast.success("Signed out successfully");
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <nav className="
      h-screen bg-background
      flex flex-wrap md:flex-row md:flex-nowrap items-center justify-between
      overflow-hidden z-10 py-4 px-6 border-r
    ">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        <Link
          href="/"
          className="md:block text-left md:pb-2 text-foreground mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
        >
          <div className="flex items-center justify-center gap-2">
            <Image
              className="float-left"
              src="/logo.png"
              alt="RRMS"
              width={48}
              height={48}
            />
            <div className="float-left text-xl">RRMS</div>
          </div>
        </Link>
        {/* User */}
        <ul className="md:hidden items-center flex flex-wrap list-none">
          <li className="inline-block relative">
            NotificationDropdown
          </li>

        </ul>
        {/* Collapse */}
        <div className="md:flex md:flex-col md:justify-between md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ">
          <div className="w-full space-y-6">
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    href="/"
                    className="md:block text-left md:pb-2 text-slate-600 mr-0 inline-block whitespace-nowrap text-lg uppercase font-bold p-4 px-0"
                  >
                    RRMS
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2">
              <Avatar>
                <AvatarImage src={userData?.avatar} />
                <AvatarFallback>{`${userData?.firstName[0]}${userData?.lastName[0]}`}</AvatarFallback>
              </Avatar>
              <CardHeader className="flex-1 p-0">
                <CardTitle className="text-sm font-medium truncate">{`${userData?.firstName} ${userData?.lastName}`} ({userRoleName(userData?.role)})</CardTitle>
                <CardDescription className="text-sm">
                  {userData?.email}
                </CardDescription>
              </CardHeader>
            </div>
            {/* Navigation */}
            <div>
              {[
                {
                  label: "Thống kê",
                  icon: <Home className="w-6 h-6" />,
                  href: "/admin/dashboard",
                },
                {
                  label: "Yêu cầu xác minh",
                  icon: <ShieldCheck className="w-6 h-6" />,
                  href: "/admin/dashboard/properties/verification",
                },
                {
                  label: "Ngừoi dùng",
                  icon: <Users className="w-6 h-6" />,
                  href: "/admin/dashboard/users",
                },
              ].map((route, index) => (
                <Link key={index} href={route.href} className="group flex flex-row gap-4 flex-1 items-center justify-start py-4 font-medium">
                  <span className="inline-block text-sm w-4">{route.icon}</span>
                  <span className="text-xs uppercase group-hover:underline">{route.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full">
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Button
                  variant="link"
                  className="text-slate-500 hover:text-slate-400 text-xs uppercase py-3 font-bold block"
                >
                  <i className="w-4 mr-2 text-sm fas fa-right-from-bracket"></i>{" "}
                  Cài đặt
                </Button>
              </li>
              <li className="items-center">
                <Button
                  variant="link"
                  className="text-slate-500 hover:text-slate-400 text-xs uppercase py-3 font-bold block"
                  onClick={handleSignout}
                >
                  <i className="w-4 mr-2 text-sm fas fa-right-from-bracket"></i>{" "}
                  Đăng xuất
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
