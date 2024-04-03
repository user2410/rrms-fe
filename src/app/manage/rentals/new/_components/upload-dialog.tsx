import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FormValues } from "../page";
import { UseFormReturn } from "react-hook-form";
import { backendAPI } from "@/libs/axios";

type UPLOADSTAGE = "CONFIRMATION" | "PENDING" | "DONE" | "ERROR";

export default function UploadDialog({
  form,
  open,
  changeOpen,
  sessionData,
} : {
  form: UseFormReturn<FormValues, any, undefined>;
  open: boolean;
  changeOpen: () => void;
  sessionData: Session;
}) {
  const [stage, setStage] = useState<UPLOADSTAGE>("CONFIRMATION");
  const [res, setRes] = useState<any>();
  const router = useRouter();

  async function handleUpload() {
    try {
      setStage("PENDING");
      const data = form.getValues();
      // console.log("done uploading property and units");
      const rental = (await backendAPI.post("/api/rentals/", data, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data;
      setRes(rental);
      setStage("DONE");
    } catch (err) {
      console.error(err);
      setStage("ERROR");
    }
  }

  useEffect(() => {
    setStage("CONFIRMATION");
  }, [open]);

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <button hidden />
      </AlertDialogTrigger>
      <AlertDialogContent>
        {stage === "CONFIRMATION" ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2>Xác nhận thêm khách thuê <strong>{form.getValues("tenantName") as string}</strong> ? </h2>
            <div className="flex flex-row gap-2">
              <Button variant="outline" onClick={changeOpen}>Quay lại</Button>
              <Button onClick={handleUpload}>Đồng ý</Button>
            </div>
          </div>
        ) : stage === "DONE" && res ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <FaCheckCircle size={20} color="green" />
            <h2>Thêm khách thuê <strong>{form.getValues("tenantName")}</strong> thành công</h2>
            <Button variant="link" type="button" onClick={() => router.push(`/manage/rentals/rental/${res.id}`)}>Xem chi tiết</Button>
          </div>
        ) : stage === "ERROR" ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <MdCancel size={20} color="red" />
            <h2>Đã có lỗi xảy ra</h2>
            <Button onClick={changeOpen}>Quay lại</Button>
          </div>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
};
