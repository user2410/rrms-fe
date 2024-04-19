import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Contract } from "@/models/contract";
import { Rental } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { FaPhone, FaRegAddressCard } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdContactPhone } from "react-icons/md";
import TenantCoap from "./tenant_coap";
import TenantMinor from "./tenant_minor";
import TenantPet from "./tenant_pet";
import { useDataCtx } from "../_context/data.context";

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

export default function TenantCard() {
  const {rental} = useDataCtx();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thông tin bên thuê</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row gap-3">
          <div className="relative w-[196px] aspect-[9/12]">
            <Image
              src={rental.profileImage}
              fill
              alt={rental.tenantName}
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <InfoItem
              icon={<FaRegAddressCard size={16} />}
              title="Họ và tên"
              content={rental.tenantName}
            />
            <InfoItem
              icon={<MdContactPhone size={16} />}
              title="Liên lạc"
              content={(
                <>
                  <Link href={`tel:${rental.tenantPhone}`} className="flex flex-row items-center gap-2">
                    <FaPhone size={12} color="green" />
                    <span>{rental.tenantPhone}</span>
                  </Link>
                  <Link href={`mailto:${rental.tenantEmail}`} className="flex flex-row items-center gap-2">
                    <IoMdMail size={12} color="red" />
                    <span>{rental.tenantEmail}</span>
                  </Link>
                </>
              )}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-base font-medium">Người thuê cùng</div>
          <div className="text-base font-normal">
            {rental.coaps.length === 0 && (
              "Không có người thuê cùng"
            )}
            {rental.coaps.map((coap, index) => (
              <TenantCoap coap={coap} key={index}/>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-base font-medium">Trẻ vị thành niên</div>
          <div className="text-base font-normal">
            {rental.minors.map((minor, index) => (
              <TenantMinor minor={minor} key={index}/>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-base font-medium">Thú nuôi</div>
          <div className="text-base font-normal">
            {rental.pets.map((pet, index) => (
              <TenantPet pet={pet} key={index}/>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
