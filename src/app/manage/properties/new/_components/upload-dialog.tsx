import { uploadFile } from "@/actions/upload-file";
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
import { PropertyForm } from "../page";

type UPLOADSTAGE = "CONFIRMATION" | "UPLOADING_IMAGES" | "CREATING_PROPERTY" | "DONE" | "ERROR";

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

  const uploadImages = async (variables: PropertyForm) => {
    const property = JSON.parse(JSON.stringify(variables.property));
    const units = JSON.parse(JSON.stringify(variables.units));

    for (const image of property.media) {
      if (!image.type.startsWith("IMAGE")) {
        continue;
      }
      const fileUrl = await uploadFile({
        name: image.name as string,
        size: image.size as number,
        type: image.type.toLowerCase(),
        url: image.url,
      });
      image.url = fileUrl;
      image.type = 'IMAGE';
    }
    property.primaryImage = property.media[property.primaryImage].url;

    for (const unit of units) {
      if (!unit.media || unit.media.length === 0) { continue; }
      for (const image of unit.media) {
        if (!image.type.startsWith("IMAGE")) {
          continue;
        }
        const fileUrl = await uploadFile({
          name: image.name as string,
          size: image.size as number,
          type: image.type.toLowerCase(),
          url: image.url,
        });
        image.url = fileUrl;
        image.type = 'IMAGE';
      }
    }

    return { property, units };
  };

  const createProperty = async ({ property, units }: { property: any, units: any[] }) => {
    const newProperty = (await backendAPI.post('/api/properties', {
      ...property,
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })).data;
    const newUnits = await Promise.all(units.map(async (unit) => {
      const unitData = (await backendAPI.post('/api/units', {
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
    return {property: newProperty, units: newUnits};
  };

  async function handleUpload() {
    try {
      setStage("UPLOADING_IMAGES");
      const { property, units } = await uploadImages({
        property: form.getValues("property"),
        units: form.getValues("units"),
      });

      // 2. Preprocess data
      for (const feature of property.features) {
        feature.featureId = parseInt(feature.featureId);
      }
      const isMultiUnit = (["APARTMENT", "ROOM"].includes(property.type) && units.length > 1) || property.type === "MINIAPARTMENT";
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

      // 3. Create a new property record
      // console.log("about to upload property and units", property, units);
      setStage("CREATING_PROPERTY");
      const newProperty = await createProperty({ property, units });
      setRes(newProperty);

      // console.log("done uploading property and units");
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
        ) : stage === "UPLOADING_IMAGES" ? (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2>Đang tải lên hình ảnh</h2>
            <p>Vui lòng đợi trong giây lát...</p>
            <Spinner size={16} />
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
