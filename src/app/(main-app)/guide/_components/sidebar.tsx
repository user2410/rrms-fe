"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function Sidebar() {

  return (
    <div className="space-y-3">
      <ScrollArea className="space-y-2 max-h-[60vh]">
        <h3 className="text-lg font-semibold">Chủ nhà / người quản lý</h3>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-normal">Nhà cho thuê</AccordionTrigger>
            <AccordionContent>
              <ul className="ml-6 mt-4 space-y-2">
                <li className="text-sm w-full">
                  <Link href="/guide/manager/properties/new" className="hover:underline w-full">
                    Tạo thông tin nhà cho thuê
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Gửi lời mời quản lý
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Yêu cầu xác minh nhà cho thuê
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-normal">Tin đăng</AccordionTrigger>
            <AccordionContent>
              <ul className="ml-6 mt-4 space-y-2">
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Đăng tin nhà cho thuê
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Bảng giá tin đăng
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Nâng cấp và gia hạn tin đăng
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="font-normal">Đơn ứng tuyển thuê nhà</AccordionTrigger>
            <AccordionContent>
              <ul className="ml-6 mt-4 space-y-2">
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Quản lý đơn ứng tuyển thuê nhà
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Phê duyệt / từ chối
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Gửi lời mời ứng tuyển
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="font-normal">Quản lý thuê</AccordionTrigger>
            <AccordionContent>
              <ul className="ml-6 mt-4 space-y-2">
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Tạo profile người thuê
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Tạo hợp đồng văn bản
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Quản lý chi phí
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Quản lý báo cáo vấn đề
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Khách thuê</h3>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="font-normal">Tìm kiếm</AccordionTrigger>
            <AccordionContent>
              <ul className="ml-6 mt-4 space-y-2">
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Tìm kiếm tin đăng nhà cho thuê
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Đánh dấu yêu thích
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="font-normal">Ứng tuyển thuê nhà</AccordionTrigger>
            <AccordionContent>
              <ul className="ml-6 mt-4 space-y-2">
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Tạo hồ sơ ứng tuyển thuê nhà
                  </Link>
                </li>
                <li className="text-sm w-full">
                  <Link href="#" className="hover:underline w-full">
                    Rút đơn ứng tuyển thuê nhà
                  </Link>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="space-y-2"></div>
    </div>
  );
};
