import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useEffect, useRef, useState } from "react";
import { ManagedApplication } from "@/models/application";
import { backendAPI } from "@/libs/axios";
import Spinner from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { Session } from "next-auth";

type STAGE = "CONFIRMATION" | "SUBMITTING" | "SUCCESS" | "ERROR";

export default function RejectDiaglog({
  data,
  sessionData,
}: {
  data: ManagedApplication;
  sessionData: Session;
}) {
  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [stage, setStage] = useState<STAGE>("CONFIRMATION");

  useEffect(() => {
    setStage("CONFIRMATION");
  }, []);

  async function handleAccept() {
    setStage("SUBMITTING");
    try {
      console.log("payload", { 
        status: "REJECTED",
        message: messageRef.current?.value,
      },);
      await backendAPI.patch(
        `/api/applications/application/status/${data.application.id}`,
        { 
          status: "REJECTED",
          message: messageRef.current?.value,
        },
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
          variant="destructive"
          disabled={["APPROVED", "REJECTED"].includes(data.application.status)}
        >
          Từ chối
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        {stage === "CONFIRMATION"
          ? (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Từ chối đơn thuê nhà</AlertDialogTitle>
                <AlertDialogDescription>Ứng viên sẽ được thông báo và bạn không còn xem được đơn ứng tuyển này. </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="space-y-2">
                <Label htmlFor="message">Lý do từ chối</Label>
                <Textarea id="message" ref={messageRef}/>
              </div>
              <div className="flex flex-row justify-end gap-2">
                <Button type="button" variant="ghost">Hủy</Button>
                <Button 
                  type="submit" variant="destructive"
                  onClick={handleAccept}
                >
                  Từ chối
                </Button>
              </div>
            </>
          ) : stage === "SUBMITTING" ? (
            <AlertDialogHeader className="flex flex-col items-center">
              <Spinner />
              <AlertDialogTitle>Đang xử lý</AlertDialogTitle>
            </AlertDialogHeader>
          ) : stage === "SUCCESS" ? (
            <>
              <AlertDialogHeader className="flex flex-col items-center space-y-3">
                <FaCheckCircle size={32} color="green" />
                <AlertDialogTitle>Đã từ chối đơn ứng tuyển</AlertDialogTitle>
                <AlertDialogDescription>Thông báo sẽ được tới <strong>{data.application.fullName}</strong>.</AlertDialogDescription>
              </AlertDialogHeader>
              <Button variant="link" onClick={() => triggerBtnRef.current?.click()}>OK</Button>
            </>
          ) : (
            <>
              <AlertDialogHeader className="flex flex-col items-center">
                <AlertDialogTitle>Đã có lỗi xảy ra</AlertDialogTitle>
              </AlertDialogHeader>
              <Separator className="my-6" />
              <div className="flex flex-row justify-center gap-2">
                <DialogClose asChild>
                  <Button variant="ghost">Hủy</Button>
                </DialogClose>
                <Button onClick={handleAccept}>Thử lại</Button>
              </div>
            </>
          )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
