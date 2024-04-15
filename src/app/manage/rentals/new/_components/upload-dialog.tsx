import { uploadFile } from "@/actions/upload-file";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { backendAPI } from "@/libs/axios";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { FormValues } from "../page";
import Link from "next/link";

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
      const pi = data.tenant.profileImage;
      // console.log("done uploading property and units");
      const profileImage = pi.name ? await uploadFile({
        name: pi.name as string,
        size: pi.size as number,
        type: pi.type!.toLowerCase(),
        url: pi.url,
      }) : pi.url;
      const rental = (await backendAPI.post("/api/rentals/", {
        ...data,

        ...data.tenant,
        coaps: data.tenant.tenantType === "FAMILY" ? data.tenant.coaps : [],
        minors: data.tenant.tenantType === "FAMILY" ? data.tenant.minors : [],
        pets: (data.tenant.tenantType === "INDIVIDUAL" || data.tenant.tenantType === "FAMILY") ? data.tenant.pets : [],

        ...data.services,
        services: data.services.services,
        
        ...data.policies,
        policies: data.policies.policies,

        profileImage,
      }, {
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
