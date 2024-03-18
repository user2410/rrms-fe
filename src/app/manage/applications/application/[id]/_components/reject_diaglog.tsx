import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Fragment, useEffect, useRef, useState } from "react";
import { ManagedApplication } from "@/models/application";
import { backendAPI } from "@/libs/axios";
import Spinner from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";

type STAGE = "CONFIRMATION" | "SUBMITTING" | "SUCCESS" | "ERROR";

export default function RejectDiaglog({
  data,
  accessKey,
  userId,
  refresh,
}: {
  data: ManagedApplication;
  accessKey: string;
  userId: string;
  refresh: () => void;
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
        { headers: { Authorization: `Bearer ${accessKey}` } }
      );
      setStage("SUCCESS");
      refresh();
    } catch (err) {
      console.error(err);
      setStage("ERROR");
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          ref={triggerBtnRef}
          variant="destructive"
          disabled={["APPROVED", "REJECTED"].includes(data.application.status)}
          className={data.application.creatorId === userId ? "hidden" : ""}
        >
          Từ chối
        </Button>
      </DialogTrigger>
      <DialogContent>
        {stage === "CONFIRMATION"
          ? (
            <>
              <DialogHeader>
                <DialogTitle>Từ chối đơn thuê nhà</DialogTitle>
                <DialogDescription>Ứng viên sẽ được thông báo và bạn không còn xem được đơn ứng tuyển này. </DialogDescription>
              </DialogHeader>
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
            <DialogHeader className="flex flex-col items-center">
              <Spinner />
              <DialogTitle>Đang xử lý</DialogTitle>
            </DialogHeader>
          ) : stage === "SUCCESS" ? (
            <>
              <DialogHeader className="flex flex-col items-center space-y-3">
                <FaCheckCircle size={32} color="green" />
                <DialogTitle>Đã từ chối đơn ứng tuyển</DialogTitle>
                <DialogDescription>Thông báo sẽ được tới <strong>{data.application.fullName}</strong>.</DialogDescription>
              </DialogHeader>
              <Button variant="link" onClick={() => triggerBtnRef.current?.click()}>OK</Button>
            </>
          ) : (
            <>
              <DialogHeader className="flex flex-col items-center">
                <DialogTitle>Đã có lỗi xảy ra</DialogTitle>
              </DialogHeader>
              <Separator className="my-6" />
              <div className="flex flex-row justify-center gap-2">
                <DialogClose asChild>
                  <Button variant="ghost">Hủy</Button>
                </DialogClose>
                <Button onClick={handleAccept}>Thử lại</Button>
              </div>
            </>
          )}
      </DialogContent>
    </Dialog>
  );
};
