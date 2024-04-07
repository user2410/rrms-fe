import ZaloIcon from "@/assets/zalo_icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ManagedApplication } from "@/models/application";
import { RentalCoap } from "@/models/rental";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FaBirthdayCake, FaBusinessTime, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

export default function TenantCoap({
  coap,
} : {
  coap: RentalCoap;
}) {
  const router = useRouter();
  const dob = new Date(coap.dob);
  
  return (
    <div className="border flex flex-row justify-between py-2">
      <div className="space-y-2 px-4">
        <div className="text-lg font-semibold">{coap.fullName}</div>
        <div className="text-md font-normal flex flex-row items-center gap-2">
          <FaBirthdayCake size={16} />
          <span>{format(dob, "dd/MM/yyyy")} ({(new Date()).getFullYear() - dob.getFullYear()} tuổi)</span>
        </div>
        <div className="text-md font-normal flex flex-row items-center gap-2">
          <FaBusinessTime size={16} />
          <span>{coap.job} - {coap.income} triệu/tháng</span>
        </div>
        <div className="text-sm font-light truncate">{coap.description}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Liên hệ ...</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="space-x-1" onClick={() => router.push(`tel:${coap.phone}`)}>
            <FaPhone size={12} color="green" />
            <span>{coap.phone}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="space-x-1" onClick={() => router.push(`https://zalo.me/${coap.phone}`)}>
            <ZaloIcon className="w-3 h-3"/>
            <span>{coap.phone}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="space-x-1" onClick={() => router.push(`mailto:${coap.email}`)}>
            <IoMdMail size={12} color="red" />
            <span>{coap.email}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
