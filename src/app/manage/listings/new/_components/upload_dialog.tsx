import { UseFormReturn } from "react-hook-form";
import { ListingFormValues } from "../page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { backendAPI } from "@/libs/axios";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Spinner from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";

type UPLOADSTAGE = "CONFIRMATION" | "CREATING_LISTING" | "DONE" | "ERROR";

export default function UploadDialog({
  form,
  open,
  changeOpen,
}: {
  form: UseFormReturn<ListingFormValues, any, undefined>;
  open: boolean;
  changeOpen: () => void;
}) {
  const [stage, setStage] = useState<UPLOADSTAGE>("CONFIRMATION");
  const [res, setRes] = useState<any>();
  const router = useRouter();
  const { data: session } = useSession();
  const accessToken = session!.user.accessToken;

  async function handleUpload() {
    setStage("CREATING_LISTING");
    try {
      // preprocessing data
      const data = form.getValues();
      const sendData = {
        ...data.listing,
        propertyID: data.propertyId,
        units: data.units,
        ...data.contact,
        ...data.config,
      };
      // if mulitple units are selected, the price is the average of all the units
      if (data.units.length > 1) {
        const unitsPrice = data.units.map(u => u.price);
        unitsPrice.sort();
        sendData.price = unitsPrice[unitsPrice.length >> 1];
      } else if (data.units.length === 1) {
        data.units[0].price = sendData.price;
      } 

      // send POST request to backend
      const listing = (await backendAPI.post("/api/listings", sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })).data;
      
      const listingPayment = (await backendAPI.post(`/api/listings/listing/${listing.id}/payment`, {
        priority: data.config.priority,
        postDuration: data.config.postDuration,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }));

      setRes({listing, listingPayment});
      setStage("DONE");
    } catch (err) {
      console.error(err);
      setStage("ERROR");
    }
  };

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
            <p className="text-gray-500">Đồng ý tạo tin đăng <strong>{form.getValues("listing.title")}</strong></p>
            <div className="flex flex-row items-center gap-2 mt-4">
              <Button onClick={changeOpen}>Quay lại</Button>
              <Button onClick={handleUpload}>Đồng ý</Button>
            </div>
          </div>
        )}
        {stage == "CREATING_LISTING" && (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <h2>Đang tạo nhà cho thuê</h2>
            <p>Vui lòng đợi trong giây lát...</p>
            <Spinner size={16} />
          </div>
        )}
        {stage === "DONE" && (
          <div className="w-full flex flex-col items-center justify-center gap-2">
            <FaCheckCircle size={20} color="green" />
            <h2>Tin đăng của bạn đã được ghi nhận</h2>
            <p className="text-sm font-light">Thanh toán ngay để tin đăng được hiển thị</p>
            <div className="flex flex-row items-center gap-2">
              <Button variant="link" type="button" onClick={() => router.push(`/manage/payment/${res.listingPayment.id}`)}>Thanh toán tin đăng</Button>
            </div>
          </div>
        )}
        {stage === "ERROR" && (
          <div className="mt-4">
            <h2>Đã có lỗi xảy ra</h2>
            <Button onClick={changeOpen}>Quay lại</Button>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};
