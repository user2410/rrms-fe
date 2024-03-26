import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { backendAPI } from "@/libs/axios";
import { PreRental, PreRentalContract } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { FormValues } from "../page";
import ContractEditor from "./contract_editor";
import { Session } from "next-auth";

export default function CreateContract({
  sessionData,
  preRental,
}: {
  sessionData: Session;
  preRental: PreRental;
}) {
  const form = useFormContext<FormValues>();
  const contractType = form.watch("contractType");

  async function handlePrepareContract(type: string) {
    try {
      const res = await backendAPI.post(`/api/prerentals/prerental/${preRental.id}/contract`, {
        contractType: type,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      });
      form.setValue("contractType", res.data.contractType);
      form.setValue("contractContent", res.data.contractContent);
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra");
    }
  }

  return (
    <div>
      <h1>Hợp đồng cho thuê</h1>
      {contractType === "DIGITAL" ? (
        <div>
          <FormField
            control={form.control}
            name="contractContent"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ContractEditor {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ) : contractType === "IMAGE" ? (
        <></>
      ) : contractType === "FILE" ? (
        <></>
      ) : (
        <div className="flex flex-col items-center">
          <h1>Chọn loại hợp đồng</h1>
          <div className="flex flex-row items-center gap-2">
            <Button onClick={() => handlePrepareContract("DIGITAL")}>Hợp đồng chuẩn bị sẵn</Button>
            <Button onClick={() => handlePrepareContract("IMAGE")}>Ảnh chụp</Button>
            <Button onClick={() => handlePrepareContract("FILE")}>Chọn file</Button>
          </div>
        </div>
      )}
    </div>
  );
};
