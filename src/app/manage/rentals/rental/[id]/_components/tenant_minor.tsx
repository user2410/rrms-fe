
import ZaloIcon from "@/assets/zalo_icon";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RentalMinor } from "@/models/rental";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FaBirthdayCake, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

export default function TenantMinor({
  minor,
} : {
  minor: RentalMinor;
}) {
  const router = useRouter();
  const dob = new Date(minor.dob);
  
  return (
    <div className="border flex flex-row justify-between py-2">
      <div className="space-y-2 px-4">
        <div className="text-lg font-semibold">{minor.fullName}</div>
        <div className="text-md font-normal flex flex-row items-center gap-2">
          <FaBirthdayCake size={16} />
          <span>{format(dob, "dd/MM/yyyy")} ({(new Date()).getFullYear() - dob.getFullYear()} tuổi)</span>
        </div>
        <div className="text-sm font-light truncate">{minor.description}</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Liên hệ ...</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {minor.phone && (
            <>
              <DropdownMenuItem className="space-x-1" onClick={() => router.push(`tel:${minor.phone}`)}>
                <FaPhone size={12} color="green" />
                <span>{minor.phone}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="space-x-1" onClick={() => router.push(`https://zalo.me/${minor.phone}`)}>
                <ZaloIcon className="w-3 h-3" />
                <span>{minor.phone}</span>
              </DropdownMenuItem>
            </>
          )}
          {minor.email && (
            <DropdownMenuItem className="space-x-1" onClick={() => router.push(`mailto:${minor.email}`)}>
              <IoMdMail size={12} color="red" />
              <span>{minor.email}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
