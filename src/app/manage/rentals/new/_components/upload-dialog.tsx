import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { backendAPI } from "@/libs/axios";
import { Session } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import preUploadRental from "../_actions/preupload";
import { FormValues } from "../page";

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
      const submitData = await preUploadRental(form.getValues(), sessionData.user.accessToken);
      const rental = (await backendAPI.post("/api/rentals/create", submitData, {
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
            <h2>Xác nhận thêm khách thuê <strong>{form.getValues("tenant.tenantName") as string}</strong> ? </h2>
            <div className="flex flex-row gap-2">
              <Button variant="outline" onClick={changeOpen}>Quay lại</Button>
              <Button onClick={handleUpload}>Đồng ý</Button>
            </div>
          </div>
        ) : stage === "DONE" && res ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <FaCheckCircle size={20} color="green" />
            <h2>Thêm khách thuê <strong>{form.getValues("tenant.tenantName")}</strong> thành công</h2>
            <Link href={`/manage/rentals/rental/${res.id}`}>Xem chi tiết</Link>
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
