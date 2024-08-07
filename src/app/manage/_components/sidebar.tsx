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
import SidebarNavigation from "./sidebar_navigation";
import Logo from "@/components/ui/logo";

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
      overflow-hidden z-10 py-4 px-6
    ">
      <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
        {/* Collapse */}
        <div className="md:flex md:flex-col md:justify-between md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded ">
          <div className="w-full pl-1 sm:pl-0 space-y-6">
            {/* Collapse header */}
            <div className="min-w-full block p-2 ">
              <div className="w-6/12">
                <Link
                  href="/"
                  className="md:block text-left md:pb-2 text-slate-600 mr-0 inline-block whitespace-nowrap text-lg uppercase font-bold p-4 px-0"
                >
                  <Logo size={64}/>
                </Link>
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
            {userData?.role === "LANDLORD" ? (
              <SidebarNavigation routes={
                [
                  {
                    label: 'Nhà cho thuê',
                    href: '/manage/properties',
                    icon: <BsFillBuildingsFill size={ICON_SIZE} />,
                  },
                  {
                    label: 'Tin đăng',
                    href: '/manage/listings',
                    icon: <BsBuildingFillAdd size={ICON_SIZE} />,
                  },
                  {
                    label: 'Đơn ứng tuyển',
                    href: '/manage/applications/to-me',
                    icon: <FaFile size={ICON_SIZE} />,
                  },
                  {
                    label: 'Quản lý thuê',
                    href: '/manage/rentals',
                    icon: <FaHandHolding size={ICON_SIZE} />,
                  },
                  {
                    label: 'Thu chi',
                    href: '/manage/payments',
                    icon: <FaMoneyBill size={ICON_SIZE} />,
                  },
                  {
                    label: 'Tài khoản',
                    href: '/manage/my-account',
                    icon: <FaUser size={ICON_SIZE} />,
                  },
                  {
                    label: 'Feedback',
                    href: '/manage/feedback',
                    icon: <FiLifeBuoy size={ICON_SIZE} />,
                  },
                ]
              } />
            ) : userData?.role === "TENANT" ? (
              <SidebarNavigation routes={
                [
                  {
                    label: 'Đơn ứng tuyển',
                    href: '/manage/applications/my-applications',
                    icon: <FaFile size={ICON_SIZE} />,
                  },
                  {
                    label: 'Nhà thuê',
                    href: '/manage/rentals',
                    icon: <BsFillBuildingsFill size={ICON_SIZE} />,
                  },
                  {
                    label: 'Báo cáo',
                    href: '/manage/rentals/rental-complaints',
                    icon: <FaFileAlt size={ICON_SIZE} />,
                  },
                  {
                    label: 'Tài khoản',
                    href: '/manage/my-account',
                    icon: <FaUser size={ICON_SIZE} />,
                  },
                  {
                    label: 'Feedback',
                    href: '/manage/feedback',
                    icon: <FiLifeBuoy size={ICON_SIZE} />,
                  },
                ]
              } />
            ) : null}
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
