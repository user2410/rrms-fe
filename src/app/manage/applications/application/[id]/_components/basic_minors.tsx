import ZaloIcon from "@/assets/zalo_icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ManagedApplication } from "@/models/application";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { FaBirthdayCake, FaPhone } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

export default function BasicMinors({
  data,
}: {
  data: ManagedApplication;
}) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="!p-4 lg:!p-6 bg-gray-400">
        Trẻ vị thành niên
      </CardHeader>
      <CardContent className="!p-4 lg:!p-6">
        <div className="flex flex-col gap-2">
          {data.application.minors?.map((field, index) => (
            <div key={index} className="border flex flex-row justify-between py-2">
              <div className="space-y-2 px-4">
                <div className="text-lg font-semibold">{field.fullName}</div>
                <div className="text-md font-normal flex flex-row items-center gap-2">
                  <FaBirthdayCake size={16} />
                  <span>{format(field.dob, "dd/MM/yyyy")} ({(new Date()).getFullYear() - field.dob.getFullYear()} tuổi)</span>
                </div>
                <div className="text-sm font-light truncate">{field.description}</div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">Liên hệ ...</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {field.phone && (
                    <>  
                      <DropdownMenuItem className="space-x-1" onClick={() => router.push(`tel:${field.phone}`)}>
                        <FaPhone size={12} color="green" />
                        <span>{data.application.phone}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="space-x-1" onClick={() => router.push(`https://zalo.me/${field.phone}`)}>
                        <ZaloIcon className="w-3 h-3" />
                        <span>{data.application.phone}</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  {field.email && (
                    <DropdownMenuItem className="space-x-1" onClick={() => router.push(`mailto:${field.email}`)}>
                      <IoMdMail size={12} color="red" />
                      <span>{data.application.email}</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
