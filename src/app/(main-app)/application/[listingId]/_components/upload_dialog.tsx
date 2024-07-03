import { AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import preUploadApplication from "../_actions/preupload";
import { ApplicationForm } from "./main_form";

type UPLOADSTAGE = "CONFIRMATION" | "CREATING_APPLICATION" | "DONE" | "ERROR";

export default function UploadDialog({
  form,
  open,
  changeOpen,
}: {
  form: UseFormReturn<ApplicationForm, any, undefined>;
  open: boolean;
  changeOpen: () => void;
}) {
  const [stage, setStage] = useState<UPLOADSTAGE>("CONFIRMATION");
  const [res, setRes] = useState<any>();
  const router = useRouter();
  const session = useSession();

  async function createApplication() {
    setStage("CREATING_APPLICATION");
    try {
      const accessToken = session.data?.user.accessToken;
      const sendData = await preUploadApplication(form.getValues(), accessToken!);
      // send POST request to backend
      const newApplication = (await backendAPI.post("/api/applications/create", sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })).data;

      console.log(newApplication);
      setRes(newApplication);
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
        {stage === "CONFIRMATION" && (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <p className="text-gray-500">Bạn chắc chắn muốn đăng kí nhà cho thuê <strong>{form.getValues("ld.property").name}</strong> ? Sau khi nộp đơn bạn không thể chỉnh sửa.</p>
            <div className="flex flex-row gap-2 mt-4">
              <Button type="button" variant="default" onClick={changeOpen}>Quay lại</Button>
              <Button type="button" variant="destructive" onClick={createApplication}>Đồng ý</Button>
            </div>
          </div>
        )}
        {stage == "CREATING_APPLICATION" && (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2>Đang tạo nhà cho thuê</h2>
            <p>Vui lòng đợi trong giây lát...</p>
            <Spinner size={16} />
          </div>
        )}
        {stage === "DONE" && (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <FaCheckCircle size={20} color="green" />
            <h2>Thành công gửi đơn đăng kí </h2>
            <div className="flex flex-row gap-2">
              <Link href={`/listings/${res.listingId}`} className={buttonVariants({variant: "outline"})}>Quay lại</Link>
              <Link href={`/manage/applications/application/${res.id}`}  className={buttonVariants({variant: "default"})}>Xem chi tiết</Link>
            </div>
          </div>
        )}
        {stage === "ERROR" && (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2>Đã có lỗi xảy ra</h2>
            <Button onClick={changeOpen}>Quay lại</Button>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
