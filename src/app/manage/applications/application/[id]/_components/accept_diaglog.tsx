import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

type STAGE = "CONFIRMATION" | "SUBMITTING" | "SUCCESS" | "ERROR";

export default function AcceptDiaglog({
  data,
  sessionData,
} : {
  data: ManagedApplication;
  sessionData: Session;
}) {
  const {application, property, unit} = data;
  const router = useRouter();
  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const [stage, setStage] = useState<STAGE>("CONFIRMATION");

  useEffect(() => {
    setStage("CONFIRMATION");
  }, []);

  async function handleAccept() {
    setStage("SUBMITTING");
    try {
      await backendAPI.patch(
        `/api/applications/application/${data.application.id}/status`,
        { status: "APPROVED" },
        { headers: { Authorization: `Bearer ${sessionData.user.accessToken}` } }
      );
      setStage("SUCCESS");
    } catch (err) {
      console.error(err);
      setStage("ERROR");
    }
  }

  function handleCreateRental() {
    router.push(`/manage/rentals/new/?applicationId=${application.id}&propertyId=${property.id}&unitId=${unit.id}`);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          ref={triggerBtnRef}
          variant="default"
          disabled={["APPROVED", "REJECTED"].includes(data.application.status)}
          className="bg-green-500 hover:bg-green-600"
        >
          Chấp nhận
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {stage === "CONFIRMATION"
          ? (
            <>
              <AlertDialogHeader>
                <p className="font-normal">
                  Xác nhận thông qua đơn ứng tuyển vào nhà cho thuê <strong>{data.property.name}</strong> của <strong>{data.application.fullName}</strong>
                </p>
              </AlertDialogHeader>
              <Separator className="my-6" />
              <div className="flex flex-row justify-center gap-2">
                <Button variant="ghost">Hủy</Button>
                <Button onClick={handleAccept}>Xác nhận</Button>
              </div>
            </>
          ) : stage === "SUBMITTING" ? (
            <AlertDialogHeader className="flex flex-col items-center">
              <Spinner/>
              <AlertDialogTitle>Đang xử lý</AlertDialogTitle>
            </AlertDialogHeader>
          ) : stage === "SUCCESS" ? (
            <>
              <AlertDialogHeader className="flex flex-col items-center space-y-3">
                <FaCheckCircle size={32} color="green" />
                <AlertDialogTitle>Đơn ứng tuyển đã được thông qua</AlertDialogTitle>
                <AlertDialogDescription>Tin tốt sẽ được thông báo tới các ứng viên.</AlertDialogDescription>
              </AlertDialogHeader>
              <Separator className="my-6" />
              <div className="flex flex-col items-center space-y-3">
                <h2 className="text-center">Tiếp theo, cung cấp một số thông tin về nơi ở mới của bạn</h2>
                <ol>
                  <li>Tạo hợp đồng thuê nhà</li>
                  <li>Quản lý quá trình cho thuê</li>
                </ol>
                <div className="space-y-2">
                  <Button variant="link" onClick={() => triggerBtnRef.current?.click()}>Tôi sẽ xem xét sau</Button>
                  <Link 
                    href={`/manage/rentals/new/?applicationId=${application.id}&propertyId=${property.id}&unitId=${unit.id}`}
                    className={buttonVariants({variant: "default"})}
                  >
                    Thiết đặt
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <AlertDialogHeader className="flex flex-col items-center">
                <AlertDialogTitle>Đã có lỗi xảy ra</AlertDialogTitle>
              </AlertDialogHeader>
              <Separator className="my-6" />
              <div className="flex flex-row justify-center gap-2">
                <Button variant="ghost">Hủy</Button>
                <Button onClick={handleAccept}>Thử lại</Button>
              </div>
            </>
          )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
