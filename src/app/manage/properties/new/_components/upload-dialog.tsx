import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import preUploadProperty from "../_actions/preupload";
import { PropertyForm } from "../page";

type UPLOADSTAGE = "CONFIRMATION" | "CREATING_PROPERTY" | "DONE" | "ERROR";

export default function UploadDialog({
  form,
  open,
  changeOpen,
}: {
  form: UseFormReturn<PropertyForm, any, undefined>;
  open: boolean;
  changeOpen: () => void;
}) {
  const [stage, setStage] = useState<UPLOADSTAGE>("CONFIRMATION");
  const [res, setRes] = useState<any>();
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session!.user.accessToken;

  async function handleUpload() {
    try {
      setStage("CREATING_PROPERTY");

      const data = await preUploadProperty(form.getValues(), accessToken);
      
      const newProperty = (await backendAPI.post('/api/properties/create', {
        ...data.property,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })).data;
      const newUnits = await Promise.all(data.units.map(async (unit) => {
        const unitData = (await backendAPI.post('/api/units/create', {
          ...unit,
          propertyId: newProperty.id,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })).data;
        return unitData;
      }
      ));
      setRes({property: newProperty, units: newUnits});

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
            <h2>Bạn đồng ý tạo <strong>{form.watch("property.name")}</strong> ? </h2>
            <div className="flex flex-row gap-2">
              <Button onClick={changeOpen}>Quay lại</Button>
              <Button onClick={handleUpload}>Đồng ý</Button>
            </div>
          </div>
        ) : stage === "CREATING_PROPERTY" ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2>Đang tạo nhà cho thuê</h2>
            <p>Vui lòng đợi trong giây lát...</p>
            <Spinner size={16} />
          </div>
        ) : stage === "DONE" && res ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <FaCheckCircle size={20} color="green" />
            <h2>Thành công tạo <strong>{form.watch("property.name")}</strong> </h2>
            <Button variant="link" type="button" onClick={() => router.push(`/manage/properties/property/${res.property.id}`)}>Xem chi tiết</Button>
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
