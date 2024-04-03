import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ManagedApplication, MapEmploymentStatusToText } from "@/models/application";
import { Briefcase, CircleDollarSign, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaBirthdayCake, FaPhone, FaRegAddressCard } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";
import { TbMapPin2 } from "react-icons/tb";

function InfoItem({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center gap-2">
        {icon}
        <span className="text-lg font-medium">{title}</span>
      </div>
      <div className="text-base font-normal">{content}</div>
    </div>
  );
}

export default function BasicTenant({
  data,
}: {
  data: ManagedApplication;
}) {
  const { application } = data;
  return application.tenantType === "INDIVIDUAL" ? (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Người thuê nhà
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="flex flex-row gap-4">
          <div className="relative w-[256px] aspect-[9/12]">
            <Image
              src={data?.application.profileImage}
              fill
              alt={data?.application.fullName}
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="flex-1">
            <div className="w-full grid grid-cols-2 gap-4">
              <InfoItem
                icon={<FaRegAddressCard size={16} />}
                title="Họ và tên"
                content={application.fullName}
              />
              {data?.application.dob ? (
                <InfoItem
                  icon={<FaBirthdayCake size={16} />}
                  title="Ngày sinh"
                  content={`${data.application.dob.toLocaleDateString()} (${(new Date()).getFullYear() - data.application.dob.getFullYear()} tuổi)`}
                />
              ) : null}
              <div className="space-y-2 col-span-2">
                <div className="flex flex-row items-center gap-2">
                  <MdContactPhone size={16} />
                  <span className="text-lg font-medium">Phương thức liên lạc</span>
                </div>
                <div className="text-base font-normal">
                  <Link href={`tel:${data.application.phone}`} className="flex flex-row items-center gap-2">
                    <FaPhone size={12} color="green" />
                    <span>{data.application.phone}</span>
                  </Link>
                  <Link href={`mailto:${data.application.email}`} className="flex flex-row items-center gap-2">
                    <IoMdMail size={12} color="red" />
                    <span>{data.application.email}</span>
                  </Link>
                </div>
              </div>
              <InfoItem
                icon={<Briefcase className="w-4 h-4" />}
                title={`Tình trạng nghề nghiệp: ${MapEmploymentStatusToText[data.application.employmentStatus as keyof typeof MapEmploymentStatusToText]}`}
                content={`${data.application.employmentPosition} (${data.application.employmentCompanyName})`}
              />
              <InfoItem
                icon={<CircleDollarSign className="w-4 h-4" />}
                title="Thu nhập hàng tháng"
                content={`${application.employmentMonthlyIncome.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}/tháng (${data.application.employmentMonthlyIncome / data.listing.price}x giá thuê)`}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Tổ chức
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="flex flex-row gap-4">
          <div className="relative w-[256px] aspect-[9/12]">
            <Image
              src={data?.application.profileImage}
              fill
              alt={data?.application.fullName}
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="flex-1">
            <div className="w-full grid grid-cols-2 gap-4">
              <InfoItem
                icon={<Briefcase className="w-4 h-4" />}
                title="Tên tổ chức"
                content={application.organizationName}
              />
              <InfoItem
                icon={<TbMapPin2 className="w-4 h-4" />}
                title="Trụ sở chính"
                content={application.organizationHqAddress}
              />
              <InfoItem
                icon={<Users className="w-4 h-4" />}
                title="Quy mô tổ chức"
                content={application.organizationScale}
              />
            </div>
            <Separator className="my-4" />
            <h2 className="font-semibold text-lg my-3">Người đại diện</h2>
            <div className="w-full grid grid-cols-2 gap-4">
              <InfoItem
                icon={<FaRegAddressCard size={16} />}
                title="Họ và tên"
                content={application.fullName}
              />
              <InfoItem
                icon={<MdContactPhone size={16} />}
                title="Phương thức liên lạc"
                content={(
                  <>
                    <Link href={`tel:${data.application.phone}`} className="flex flex-row items-center gap-2">
                      <FaPhone size={12} color="green" />
                      <span>{data.application.phone}</span>
                    </Link>
                    <Link href={`mailto:${data.application.email}`} className="flex flex-row items-center gap-2">
                      <IoMdMail size={12} color="red" />
                      <span>{data.application.email}</span>
                    </Link>
                  </>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
