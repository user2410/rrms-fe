import ZaloIcon from "@/assets/zalo_icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ManagedApplication } from "@/models/application";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FaBirthdayCake, FaBusinessTime, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

export default function BasicCoaps({
  data,
}: {
  data: ManagedApplication;
}) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Người thuê cùng
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="flex flex-col gap-2">
          {data.application.coaps?.map((field, index) => (
            <div key={index} className="border flex flex-row justify-between py-2">
              <div className="space-y-2 px-4">
                <div className="text-lg font-semibold">{field.fullName}</div>
                <div className="text-md font-normal flex flex-row items-center gap-2">
                  <FaBirthdayCake size={16} />
                  <span>{format(field.dob, "dd/MM/yyyy")} ({(new Date()).getFullYear() - field.dob.getFullYear()} tuổi)</span>
                </div>
                <div className="text-md font-normal flex flex-row items-center gap-2">
                  <FaBusinessTime size={16} />
                  <span>{field.job} - {field.income} triệu/tháng</span>
                </div>
                <div className="text-sm font-light truncate">{field.description}</div>
              </div>
              <div className="flex flex-row items-center">
                <Button
                  type="button" variant="link"
                  onClick={() => {}}
                >
                  Xem đơn ứng tuyển
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">Liên hệ ...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem className="space-x-1" onClick={() => router.push(`tel:${field.phone}`)}>
                      <FaPhone size={12} color="green" />
                      <span>{field.phone}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="space-x-1" onClick={() => router.push(`https://zalo.me/${field.phone}`)}>
                      <ZaloIcon className="w-3 h-3"/>
                      <span>{field.phone}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="space-x-1" onClick={() => router.push(`mailto:${field.email}`)}>
                      <IoMdMail size={12} color="red" />
                      <span>{field.email}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
