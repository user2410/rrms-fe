import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManagedApplication, MapEmploymentStatusToText } from "@/models/application";
import { Briefcase, CircleDollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaBirthdayCake, FaPhone, FaRegAddressCard } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";

export default function BasicTenant({
  data,
} : {
  data: ManagedApplication;
}) {
  return (
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
              <div className="space-y-2">
                <div className="flex flex-row items-center gap-2">
                  <FaRegAddressCard size={16} />
                  <span className="text-lg font-medium">Họ và tên</span>
                </div>
                <div className="text-base font-normal">{data?.application.fullName}</div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-row items-center gap-2">
                  <FaBirthdayCake size={16} />
                  <span className="text-lg font-medium">Ngày sinh</span>
                </div>
                <div className="text-base font-normal">{data.application.dob.toLocaleDateString()} ({(new Date()).getFullYear() - data?.application.dob.getFullYear()} tuổi)</div>
              </div>
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
              <div className="space-y-2">
                <div className="flex flex-row items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-lg font-medium">Tình trạng nghề nghiệp: {MapEmploymentStatusToText[data.application.employmentStatus as keyof typeof MapEmploymentStatusToText]}</span>
                </div>
                <div className="text-base font-normal">{data.application.employmentPosition} ({`${data.application.employmentCompanyName}`})</div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-row items-center gap-2">
                  <CircleDollarSign className="w-4 h-4" />
                  <span className="text-lg font-medium">Thu nhập hàng tháng</span>
                </div>
                <div className="text-base font-normal">{(data.application.employmentMonthlyIncome / 1e6).toFixed(0)} triệu/tháng ({`${data.application.employmentMonthlyIncome/data.listing.price}x giá thuê`})</div>
                {data.application.employmentComment && (
                  <p className="text-sm font-light">{data.application.employmentComment}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
