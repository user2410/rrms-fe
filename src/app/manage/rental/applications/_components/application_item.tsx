import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ManagedApplication } from "../page";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Check, Search, X } from "lucide-react";
import StatusCard from "./status_card";

export default function ApplicationItem({
  ma,
}: {
  ma: ManagedApplication;
}) {
  const { application, listing, property } = ma;

  const router = useRouter();

  console.log('application', ma);

  return (
    <Link href={`/manage/rental/applications/application/${application.id}`} className="block p-4 space-y-3 bg-card border">
      <div className="flex flex-row justify-between">
        <span className="text-xl font-semibold">{application.fullName}</span>
        <span className="text-sm font-light">Submitted at {application.createdAt.toLocaleDateString()} @{application.createdAt.toLocaleTimeString()}</span>
      </div>
      <div className="flex flex-row gap-2">
        <div>Ngày chuyển tới dự kiến: {application.moveinDate.toLocaleDateString()}</div>
        <Separator orientation="vertical" />
        <div>Thời gian thuê: {application.preferredTerm} tháng</div>
      </div>
      <div className="flex flex-row justify-between items-center gap-2">
        <div className="flex flex-row gap-3">
          {/* <div className="border-l-4 pl-1 border-green-400 space-y-2">
            <div className="">Documents:</div>
            <div className="font-semibold">1 (1 new)</div>
          </div> */}
          {application.employmentStatus === "EMPLOYED" ? (
            <StatusCard title="Nghề nghiệp" value={application.employmentPosition!} className="border-green-400" />
          ) : application.employmentStatus === "UNEMPLOYED" ? (
            <StatusCard title="Nghề nghiệp" value="Không có" className="border-gray-400" />
          ) : application.employmentStatus === "SELF_EMPLOYED" ? (
            <StatusCard title="Nghề nghiệp" value={application.employmentPosition!} className="border-gray-400" />
          ) : application.employmentStatus === "STUDENT" ? (
            <StatusCard title="Nghề nghiệp" value="Sinh viên" className="border-blue-400" />
          ) : null
          }
          <StatusCard title="Thu nhập" value={`${Math.ceil(application.employmentMonthlyIncome / listing.price)}x giá thuê`} className="border-red-400" />
          {application.status === "PENDING" ? (
            <StatusCard title="Trạng thái" value="Đang chờ" className="border-gray-400" />
          ) : application.status === "CONDITIONALLY_APPROVED" ? (
            <StatusCard title="Trạng thái" value="Đã duyệt" className="border-green-400" />
          ) : application.status === "APPROVED" ? (
            <StatusCard title="Trạng thái" value="Đã duyệt thành công" className="border-green-400" />
          ) : application.status === "REJECTED" ? (
            <StatusCard title="Trạng thái" value="Đã từ chối" className="border-red-400" />
          ) : null}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Thao tác...</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { }}>
              <Check className="mr-2 h-4 w-4" />
              <span>Chấp nhận</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive hover:bg-red-200">
              <X className="mr-2 h-4 w-4" />
              <span>Từ chối</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Link>
  );
};
