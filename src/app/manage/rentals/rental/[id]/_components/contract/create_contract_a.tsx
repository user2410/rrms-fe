import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";
import { getUserFullAddress, getUserFullName } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDataCtx } from "../../_context/data.context";
import CreateContractARentalDetails from "./create_contract_a-rental";
import SideA from "./create_contract_a-side_a";
import ContractEditor from "./contract_editor_b";
import toast from "react-hot-toast";
import { backendAPI } from "@/libs/axios";
import CreateContractAContract from "./create_contract_a-contract";

const formSchema = z.object({
  aFullName: z.string(),
  aDob: z.date(),
  aPhone: z.string(),
  aAddress: z.string(),
  aHouseholdRegistration: z.string(),
  aIdentity: z.string(),
  aIdentityIssuedBy: z.string(),
  aIdentityIssuedAt: z.date(),
  aDocuments: z.array(
    z.object({ cert: z.string() })
  ),
  aBankAccount: z.string().optional(),
  aBank: z.string().optional(),
  aRegistrationNumber: z.string(),

  paymentMethod: z.string(),
  nCopies: z.number().min(1),
  createdAtPlace: z.string(),
});

export type ContractAFormValues = z.infer<typeof formSchema>;

export default function CreateContractA() {
  const [step, setStep] = useState<number>(0);
  const [res, setRes] = useState<any>();
  const { owners, rental, sessionData } = useDataCtx();

  const form = useForm<ContractAFormValues>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   aFullName: getUserFullName(owners[0]),
    //   aAddress: getUserFullAddress(owners[0]),
    //   aPhone: owners[0].phone,
    // },
    defaultValues: {
      "aFullName": "Albert Alpha",
      "aAddress": "Số 1, Đường Giải Phóng, Phường Bách Khoa, Hai Bà Trưng, Hà Nội",
      "aPhone": "0912142214",
      "aDob": new Date("1989-12-12T00:00:00.000Z"),
      "aHouseholdRegistration": "Số 2 Nhà Thờ, Hoàn Kiếm, Hà Nội",
      "aIdentity": "0151651631187",
      "aIdentityIssuedBy": "Cục quản lý di trú",
      "aIdentityIssuedAt": new Date("2024-04-19T00:00:00.000Z"),
      "aBankAccount": "213854199152412",
      "aBank": "SCB",
      "aRegistrationNumber": "HTDN/1243143125",
      "aDocuments": [
        {
          "cert": "Chứng từ số ABC/12214325"
        },
        {
          "cert": "Hợp đồng HAH/1242"
        }
      ],
      "paymentMethod": "cash",
      "createdAtPlace": "Hà Nội",
      "nCopies": 2
    },
  });

  const stepperSteps = useMemo(() => {
    const steps = ([
      {
        title: "Bên A",
        description: "Bổ sung thông tin của bên cho thuê",
      },
      {
        title: "Chi tiết hợp đồng",
        description: "Thông tin hợp đồng và các điều khoản khác",
      },
    ]);
    return rental.tenantId
      ? steps
      : [
        ...steps,
        {
          title: "Hợp đồng",
          description: "Hợp đồng được sinh dựa trên những thông tin đã cung cấp",
        },
      ];
  }, [rental.tenantId]);

  async function onSubmit(data: ContractAFormValues) {
    const submitData = {
      ...data,
      aDocuments: data.aDocuments.map((doc) => doc.cert),
    };
    try {
      if (!res) {
        // create new contract record
        const contract = (await backendAPI.post(`/api/rentals/rental/${rental.id}/contract`, submitData, {
          headers: {
            Authorization: `Bearer ${sessionData.user.accessToken}`,
          }
        })).data;
        setRes(contract);
        toast.success("Hợp đồng đã được tạo thành công");
      } else {
        // update current contractconst placeholder = ".................................";

        await backendAPI.patch(`/api/contracts/contract/${res.id}`, submitData, {
          headers: {
            Authorization: `Bearer ${sessionData.user.accessToken}`,
          }
        });
        setRes(data);
        toast.success("Hợp đồng đã được cập nhật thành công");
      }
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  async function handleNext() {
    try {
      var valid: boolean = true;
      if (step === 1) {
        valid = await form.trigger(["aFullName", "aDob", "aPhone", "aAddress", "aHouseholdRegistration", "aIdentity", "aIdentityIssuedBy", "aIdentityIssuedAt", "aDocuments", "aBankAccount", "aBank", "aRegistrationNumber"]);
      } else if (step === 2) {
        valid = await form.trigger(["paymentMethod", "nCopies", "createdAtPlace"]);
      }
      if (!valid) {
        console.error(form.formState.errors);
        return;
      }
      setStep(v => (v + 1));

    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button type="button">Tạo hợp đồng</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Tạo hợp đồng cho thuê nhà</DialogTitle>
          <DialogDescription>
            Thông tin bổ sung về bên cho thuê và hợp đồng.
          </DialogDescription>
        </DialogHeader>
        <div className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
          <DetailedStepper
            currentStep={step}
            steps={stepperSteps}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[70vh]">
              {step === 0 ? (
                <SideA />
              ) : step === 1 ? (
                <CreateContractARentalDetails />
              ) : step === 2 && (
                <CreateContractAContract />
              )}
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
              {((step < 1 && rental.tenantId) || (step < 2 && !rental.tenantId))
                && (
                  <Button
                    type="button"
                    onClick={handleNext}
                  >
                    Tiếp tục
                  </Button>
                )}
              {/* {JSON.stringify(form.formState.errors)} */}
              {(step === 1 && rental.id) && (
                <Button type="submit">{res ? "Cập nhật" : "Hoàn tất"}</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  );
};

