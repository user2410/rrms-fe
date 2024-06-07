import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { backendAPI } from "@/libs/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { useDataCtx } from "../../_context/data.context";
import SideB from "./side_b";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";
import ContractEditor from "./contract_editor_b";

const formSchema = z.object({
  bFullName: z.string(),
  bOrganizationName: z.string().optional(),
  bOrganizationHqAddress: z.string().optional(),
  bOrganizationCode: z.string().optional(),
  bOrganizationCodeIssuedAt: z.date().optional(),
  bOrganizationCodeIssuedBy: z.string().optional(),
  bDob: z.date().optional(),
  bPhone: z.string(),
  bAddress: z.string(),
  bHouseholdRegistration: z.string().optional(),
  bIdentity: z.string(),
  bIdentityIssuedBy: z.string(),
  bIdentityIssuedAt: z.date(),
  bBankAccount: z.string().optional(),
  bBank: z.string().optional(),
  bTaxCode: z.string().optional(),
  content: z.string(),
});

export type ContractBFormValues = z.infer<typeof formSchema>;

export default function CreateContractB({
  contractId,
}: {
  contractId: number;
}) {
  const [step, setStep] = useState<number>(0);
  const { sessionData, rental } = useDataCtx();

  const form = useForm<ContractBFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bFullName: rental.tenantName,
      bOrganizationName: rental.organizationName ? rental.organizationName : undefined,
      bOrganizationHqAddress: rental.organizationHqAddress ? rental.organizationHqAddress : undefined,
      bPhone: rental.tenantPhone,
      content: "",
    }
    // defaultValues: {
    //   "bFullName": "Graham Gamma",
    //   "bOrganizationName": "Tri Nam",
    //   "bOrganizationHqAddress": "So 43, Phan Thua Vu, Dong Da, Ha Noi",
    //   "bPhone": "0942286285",
    //   "bOrganizationCode": "165156401586",
    //   "bOrganizationCodeIssuedAt": new Date("2024-04-03T00:00:00.000Z"),
    //   "bOrganizationCodeIssuedBy": "Ha Noi",
    //   "bDob": new Date("2024-04-03T00:00:00.000Z"),
    //   "bAddress": "65 Trần Quang Diệu, Đống Đa, Hà Nội",
    //   "bIdentity": "12345678",
    //   "bIdentityIssuedBy": "Cuc quan ly cu tru",
    //   "bIdentityIssuedAt": new Date("2024-04-01T00:00:00.000Z"),
    //   "bTaxCode": "122468431685418",
    //   "bBankAccount": "0518951651811189",
    //   "bBank": "SCB",
    //   content: '',
    // },
  });

  async function onSubmit(data: ContractBFormValues) {
    try {
      await backendAPI.patch(`/api/contracts/contract/${contractId}`, data, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        }
      });
      await backendAPI.patch(`/api/contracts/contract/${contractId}/content`, {
        id: contractId,
        status: "PENDING",
        userId: sessionData.user.user.id,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        }
      });
      toast.success("Cập nhật hợp đồng thành công");
    } catch(err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button">Bổ sung thông tin</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Bổ sung thông tin hợp đồng cho thuê nhà</DialogTitle>
          <DialogDescription>
            Bổ sung thông tin thuê nhà của bên B.
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DetailedStepper
              currentStep={step}
              steps={[
                {
                  title: "Bên A",
                  description: "Bổ sung thông tin của bên cho thuê",
                },
                {
                  title: "Chỉnh sửa hợp đồng",
                  description: "Xem và chỉnh sửa hợp đông được tạo dựa trên những thông tin đã có",
                },
              ]}
            />
            <ScrollArea className="h-[70vh]">
              {step === 0 ? (
                <SideB />
              ) : step === 1 ? (
                <ContractEditor />
              ) : null}
            </ScrollArea>
            <DialogFooter className="flex flex-row justify-between">
              <Button
                type="button"
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
              >
                Quay lại
              </Button>
              {step < 1 && (
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      const valid = await form.trigger();
                      if (valid) {
                        setStep(v => v + 1);
                      } else {
                        console.error(form.formState.errors);
                      }
                    } catch (err) {
                      console.error(err);
                      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
                    }
                  }}
                >
                  Tiếp tục
                </Button>
              )}
              {step === 1 && (
                <Button type="submit">Cập nhật</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  );
};
