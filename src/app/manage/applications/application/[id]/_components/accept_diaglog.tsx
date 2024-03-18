import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { Fragment, useEffect, useRef, useState } from "react";
import { ManagedApplication } from "@/models/application";
import { backendAPI } from "@/libs/axios";
import Spinner from "@/components/ui/spinner";
import clsx from "clsx";

type STAGE = "CONFIRMATION" | "SUBMITTING" | "SUCCESS" | "ERROR";

export default function AcceptDiaglog({
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
  const [stage, setStage] = useState<STAGE>("CONFIRMATION");

  useEffect(() => {
    setStage("CONFIRMATION");
  }, []);

  async function handleAccept() {
    setStage("SUBMITTING");
    try {
      await backendAPI.patch(
        `/api/applications/application/status/${data.application.id}`,
        { status: "APPROVED" },
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
          variant="default"
          disabled={["APPROVED", "REJECTED"].includes(data.application.status)}
          className={clsx(
            "bg-green-500 hover:bg-green-600",
            data.application.creatorId === userId && "hidden",
          )}
        >
          Chấp nhận
        </Button>
      </DialogTrigger>
      <DialogContent>
        {stage === "CONFIRMATION"
          ? (
            <>
              <DialogHeader>
                <p className="font-normal">
                  Xác nhận thông qua đơn ứng tuyển vào nhà cho thuê <strong>{data.property.name}</strong> của <strong>{data.application.fullName}</strong>
                </p>
              </DialogHeader>
              <Separator className="my-6" />
              <div className="flex flex-row justify-center gap-2">
                <Button variant="ghost">Hủy</Button>
                <Button onClick={handleAccept}>Xác nhận</Button>
              </div>
            </>
          ) : stage === "SUBMITTING" ? (
            <DialogHeader className="flex flex-col items-center">
              <Spinner/>
              <DialogTitle>Đang xử lý</DialogTitle>
            </DialogHeader>
          ) : stage === "SUCCESS" ? (
            <>
              <DialogHeader className="flex flex-col items-center space-y-3">
                <FaCheckCircle size={32} color="green" />
                <DialogTitle>Đơn ứng tuyển đã được thông qua</DialogTitle>
                <DialogDescription>Tin tốt sẽ được thông báo tới các ứng viên.</DialogDescription>
              </DialogHeader>
              <Separator className="my-6" />
              <div className="flex flex-col items-center space-y-3">
                <h2 className="text-center">Tiếp theo, cung cấp một số thông tin về nơi ở mới của bạn</h2>
                <ul className="list-disc">
                  <li>Tạo hợp đồng thuê nhà</li>
                  <li>Quản lý quá trình cho thuê</li>
                </ul>
                <div className="space-y-2">
                  {/* TODO: route user to create contract screen */}
                  <Button variant="default">Thiết đặt</Button>
                  <Button variant="link" onClick={() => triggerBtnRef.current?.click()}>Tôi sẽ xem xét sau</Button>
                </div>
              </div>
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
