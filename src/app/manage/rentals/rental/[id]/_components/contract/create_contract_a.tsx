import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import DetailedStepper from "@/components/ui/stepper/detailed-stepper";
import { getUserFullAddress, getUserFullName } from "@/models/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useDataCtx } from "../../_context/data.context";
import Rental from "./rental";
import SideA from "./side_a";
import ContractEditor from "./contract_editor_b";
import toast from "react-hot-toast";
import { backendAPI } from "@/libs/axios";

const placeholder = ".................................";
const formSchema = z.object({
  sides: z.object({
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

    bFullName: z.string(),
    bPhone: z.string(),
  }),
  paymentMethod: z.string(),
  paymentDay: z.number().min(1).max(28),
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
    defaultValues: {
      sides: {
        aFullName: getUserFullName(owners[0]),
        aAddress: getUserFullAddress(owners[0]),
        aPhone: owners[0].phone,
        bFullName: rental.tenantName,
        bPhone: rental.tenantPhone,
      },
    },
    // defaultValues: {
    //   "sides": {
    //     "aFullName": "Albert Alpha",
    //     "aAddress": "Số 1, Đường Giải Phóng, Phường Bách Khoa, Hai Bà Trưng, Hà Nội",
    //     "aPhone": "0912142214",
    //     "bFullName": "Graham Gamma",
    //     "bPhone": "0942286285",
    //     "aDob": new Date("1989-12-12T00:00:00.000Z"),
    //     "aHouseholdRegistration": "Số 2 Nhà Thờ, Hoàn Kiếm, Hà Nội",
    //     "aIdentity": "0151651631187",
    //     "aIdentityIssuedBy": "Cục quản lý di trú",
    //     "aIdentityIssuedAt": new Date("2024-04-19T00:00:00.000Z"),
    //     "aBankAccount": "213854199152412",
    //     "aBank": "SCB",
    //     "aRegistrationNumber": "HTDN/1243143125",
    //     "aDocuments": [
    //       {
    //         "cert": "Chứng từ số ABC/12214325"
    //       },
    //       {
    //         "cert": "Hợp đồng HAH/1242"
    //       }
    //     ]
    //   },
    //   "paymentMethod": "cash",
    //   "paymentDay": 5,
    //   "createdAtPlace": "Hà Nội",
    //   "nCopies": 2
    // },
  });

  async function onSubmit(data: ContractAFormValues) {
    const submitData = {
      ...data.sides,
      paymentMethod: data.paymentMethod,
      paymentDay: data.paymentDay,
      aDocuments: data.sides.aDocuments.map((doc) => doc.cert),
      nCopies: data.nCopies,
      createdAtPlace: data.createdAtPlace,
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
        // update current contract
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
            steps={[
              {
                title: "Bên A",
                description: "Bổ sung thông tin của bên cho thuê",
              },
              {
                title: "Chi tiết hợp đồng",
                description: "Thông tin hợp đồng và các điều khoản khác",
              },
              // {
              //   title: "Xem trước hợp đồng",
              //   description: "Xem trước hợp đông được tạo dựa trên những thông tin đã có",
              // },
            ]}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <ScrollArea className="h-[70vh]">
              {step === 0 ? (
                <SideA />
              ) : step === 1 ? (
                <Rental />
                // ) : step === 2 ? (
                //   // <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                //   //   <h2 className="text-xl">Hoàn thành nhập thông tin bổ sung</h2>
                //   //   <p>Thông báo sẽ được gửi tới bên thuê để hoàn thành thông tin bổ sung và tạo hợp đồng</p>
                //   // </div>
                //   <ContractEditor/>
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
                  onClick={(e) => {
                    form.trigger("sides")
                      .then((valid) => {
                        if (valid) {
                          console.log('next', form.getValues());
                          setStep(step + 1);
                        } else {
                          console.error(form.formState.errors);
                        }
                      })
                      .catch((err) => {
                        console.error(err);
                      });
                  }}
                >
                  Tiếp tục
                </Button>
              )}
              {/* {JSON.stringify(form.formState.errors)} */}
              {step === 1 && (
                <Button type="submit">{res ? "Cập nhật" : "Hoàn tất"}</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>

  );
};
