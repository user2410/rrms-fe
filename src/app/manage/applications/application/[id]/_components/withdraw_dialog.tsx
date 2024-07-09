import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Session } from "next-auth";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

type STAGE = "CONFIRMATION" | "SUBMITTING" | "SUCCESS" | "ERROR";

export default function WithdrawDiaglog({
  data,
  sessionData,
} : {
  data: ManagedApplication;
  sessionData: Session;
}) {
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
        { status: "WITHDRAWN" },
        { headers: { Authorization: `Bearer ${sessionData.user.accessToken}` } }
      );
      setStage("SUCCESS");
    } catch (err) {
      console.error(err);
      setStage("ERROR");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          ref={triggerBtnRef}
          variant="default"
          disabled={["APPROVED", "REJECTED"].includes(data.application.status)}
        >
          Rút đơn
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {stage === "CONFIRMATION"
          ? (
            <>
              <AlertDialogHeader>
                <p className="font-normal">
                  Xác nhận rút đơn ứng tuyển vào nhà cho thuê <strong>{data.property.name}</strong>
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
              <Spinner size={16}/>
              <AlertDialogTitle>Đang xử lý</AlertDialogTitle>
            </AlertDialogHeader>
          ) : stage === "SUCCESS" ? (
            <>
              <AlertDialogHeader className="flex flex-col items-center space-y-3">
                <FaCheckCircle size={32} color="green" />
                <AlertDialogTitle>Đẫ rút đơn ứng tuyển </AlertDialogTitle>
              </AlertDialogHeader>
              <Separator className="my-6" />
              <div className="flex flex-row justify-center">
                <Link className={buttonVariants({variant: "default"})} href="/manage/applications/my-applications">Đóng</Link>
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
