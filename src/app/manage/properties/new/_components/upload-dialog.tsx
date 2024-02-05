import { Fragment, useEffect, useState } from "react";
import { PropertyForm } from "../page";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Spinner from "@/components/ui/spinner";
import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { UseFormReturn } from "react-hook-form";
import { uploadFile } from "@/actions/upload-file";
import { useSession } from "next-auth/react";
import { backendAPI } from "@/libs/axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type UPLOAD_STAGE = "UPLOADING_IMAGES" | "CREATING_PROPERTY" | "DONE" | "ERROR";

export default function UploadDialog({
  form,
  open,
  changeOpen,
}: {
  form: UseFormReturn<PropertyForm, any, undefined>;
  open: boolean;
  changeOpen: () => void;
}) {
  const [stage, setStage] = useState<UPLOAD_STAGE>("UPLOADING_IMAGES");
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session!.user.accessToken;

  useEffect(() => {
    if (!open) {
      return;
    }

    const property = form.getValues("property") as any;
    const units = form.getValues("units") as any;

    (async () => {
      try {
        // 1. Upload all images
        setStage("UPLOADING_IMAGES");
        for (const image of property.media.filter((m: any) => m.type.startsWith('IMAGE'))) {
          const fileUrl = await uploadFile({
            name: image.name as string,
            size: image.size as number,
            type: image.type.toLowerCase(),
            url: image.url,
          }, accessToken);
          image.url = fileUrl;
          image.type = 'IMAGE';
        }
    
        for (const unit of units) {
          for (const image of unit.media) {
            const fileUrl = await uploadFile({
              name: image.name as string,
              size: image.size as number,
              type: image.type.toLowerCase(),
              url: image.url,
            }, accessToken);
            image.url = fileUrl;
            image.type = 'IMAGE';
          }
        }
        
        // 2. Preprocess data
        for (const feature of property.features) {
          feature.featureId = parseInt(feature.featureId);
        }
        const isMultiUnit = (["APARTMENT", "ROOM"].includes(property.type) && property.multiUnit) || property.type === "MINIAPARTMENT";
        var totalUnitArea = 0;
        for (const unit of units) {
          if (isMultiUnit) { totalUnitArea += unit.area; }
          for (const amenity of unit.amenities) {
            amenity.amenityId = parseInt(amenity.amenityId);
          }
        }
        if (isMultiUnit) {
          property.area = totalUnitArea / units.length;
        }
    
        // 2. Create a new property record
        setStage("CREATING_PROPERTY");
        const newProperty = (await backendAPI.post('/api/properties', {
          ...property,
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })).data;
    
        // 3. Create all units records
        for (const unit of units) {
          const newUnit = (await backendAPI.post('/api/units', {
            ...unit,
            propertyId: newProperty.id,
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })).data;
        }
        setStage("DONE");
      } catch(err) {
        console.error(err);
        setStage("ERROR");
      } 
    })();
  }, [open]);

  return (
    <AlertDialog open={open}>
      <AlertDialogTrigger asChild>
        <button hidden />
      </AlertDialogTrigger>
      <AlertDialogContent>
        {stage === "UPLOADING_IMAGES" ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2>Đang tải lên hình ảnh</h2>
            <p>Vui lòng đợi trong giây lát...</p>
            <Spinner />
          </div>
        ) : stage === "CREATING_PROPERTY" ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2>Đang tạo nhà cho thuê</h2>
            <p>Vui lòng đợi trong giây lát...</p>
            <Spinner />
          </div>
        ) : stage === "DONE" ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <FaCheckCircle size={20} color="green" />
            <h2>Thành công</h2>
            <Button onClick={() => router.push('/manage/properties')}>Nhà cho thuê</Button>
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
