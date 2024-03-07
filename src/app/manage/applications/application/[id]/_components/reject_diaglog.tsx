import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Fragment, useEffect, useRef, useState } from "react";
import { ManagedApplication } from "@/models/application";
import { backendAPI } from "@/libs/axios";
import Spinner from "@/components/ui/spinner";

type STAGE = "CONFIRMATION" | "SUBMITTING" | "SUCCESS" | "ERROR";

export default function RejectDiaglog({
  data,
  accessKey,
  refresh,
}: {
  data: ManagedApplication;
  accessKey: string;
  refresh: () => void;
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
        `/api/applications/application/status/${data.application.id}`,
        { status: "REJECTED" },
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
              <div className="flex flex-row justify-end gap-2">
                <Button variant="ghost">Hủy</Button>
                <Button variant="destructive">Từ chối</Button>
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
                <Button variant="ghost">Hủy</Button>
                <Button onClick={handleAccept}>Thử lại</Button>
              </div>
            </>
          )}
      </DialogContent>
    </Dialog>
  );
};
