import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Payment } from "@/models/payment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FaCheckCircle } from "react-icons/fa";
import { ListingFormValues } from "../page";

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
  const [res, setRes] = useState<{
    listing: Listing;
    payment: Payment;
  }>();
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
        tags: data.listing.tags.map(t => t.tag),
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
      const res = (await backendAPI.post("/api/listings", sendData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })).data;

      setRes(res);
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
            <p className="text-gray-500 text-center">Đồng ý tạo tin đăng <br/> <strong>{form.getValues("listing.title")}</strong></p>
            <div className="flex flex-row items-center gap-2 mt-4">
              <Button variant="outline" onClick={changeOpen}>Quay lại</Button>
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
              <Link href={`/manage/listings/listing/${res!.listing.id}`} className={buttonVariants({variant: "outline"})}>Xem tin đăng</Link>
              <Link target="_blank" href={`/manage/payments/payment/${res!.payment.id}`} className={buttonVariants({variant: "default"})}>Thanh toán tin đăng</Link>
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
