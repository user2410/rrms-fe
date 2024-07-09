"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export default function Header() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          Hướng dẫn
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {document.title}
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
