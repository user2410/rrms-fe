import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { backendAPI } from "@/libs/axios";
import { Contract } from "@/models/contract";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDataCtx } from "../../_context/data.context";
import Editor from "./editor";


export default function ContractEditorWrapper({
  handleSubmit,
}: {
  handleSubmit: () => void;
}) {
  const data = useDataCtx();

  const query = useQuery<Contract>({
    queryKey: ["manage", "rentals", "rental", data.rental.id, "contract", data.sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<Contract>(`/api/rentals/rental/${data.rental.id}/contract`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        }
      })).data;
    },
  });

  return query.isLoading ? (
    <div className="">
      Đang tải dữ liệu...
    </div>
  ) : query.isError ? (
    <div>
      Đã xảy ra lỗi khi tải dữ liệu
    </div>
  ) : (
    <ContractEditor
      contract={query.data}
      handleSubmit={handleSubmit}
      refetch={() => query.refetch()}
    />
  );
}

function ContractEditor({
  contract,
  handleSubmit,
  refetch,
}: {
  contract: Contract;
  handleSubmit: () => void;
  refetch: () => void;
}) {
  const [value, setValue] = useState<string>(contract.content);
  const triggerBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  function reset() {
    setValue(contract.content);
  }

  useEffect(() => {
    setValue(contract.content);
  }, [contract.content]);

  return (
    <Dialog onOpenChange={() => {
      console.log("onOpenChange refetch");
      refetch();
    }}>
      <DialogTrigger asChild>
        <Button type="button" ref={triggerBtnRef}>Chỉnh sửa hợp đồng</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hợp đồng</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <Editor value={value} onChange={setValue} />
          <table border={0} cellPadding={0} cellSpacing={0} style={{
            border: "#d3d3d3 1px dotted",
            width: "100%",
          }}>
            <tbody>
              <tr>
                <td>
                  <p style={{ textAlign: "center" }}><strong><span style={{ fontFamily: "times new roman,times,serif" }}>BÊN CHO THUÊ</span></strong></p>
                  <p style={{ textAlign: "center" }}><em><span style={{ fontFamily: "times new roman,times,serif" }}>(ký và ghi rõ họ tên)</span></em></p>
                </td>
                <td>
                  <p style={{ textAlign: "center" }}><strong><span style={{ fontFamily: "times new roman,times,serif" }}>BÊN THUÊ</span></strong></p>
                  <p style={{ textAlign: "center" }}><em><span style={{ fontFamily: "times new roman,times,serif" }}>(ký và ghi rõ họ tên)</span></em></p>
                </td>
              </tr>
            </tbody>
          </table>
        </ScrollArea>
        <DialogFooter className="flex flex-row justify-end">
          <Button type="button" variant="outline" onClick={reset}>Reset</Button>
          <DialogClose asChild>
            <button hidden ref={closeBtnRef}/>
          </DialogClose>
          <ActionModal
            contractId={contract.id}
            status="SIGNED"
            value={value}
            handleSubmit={() => {
              handleSubmit();
              closeBtnRef.current?.click();
            }}
          />
          <ActionModal
            contractId={contract.id}
            status="PENDING"
            value={value}
            handleSubmit={() => {
              handleSubmit();
              closeBtnRef.current?.click();
            }}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function ActionModal({
  contractId,
  status,
  value,
  handleSubmit,
} : {
  contractId: number;
  status: "PENDING" | "SIGNED";
  value: string;
  handleSubmit: () => void;
}) {
  const { sessionData } = useDataCtx();

  async function handleUpdate() {
    try {
      await backendAPI.patch(`/api/contracts/contract/${contractId}/content`, {
        id: contractId,
        content: value,
        status: status,
      }, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        }
      });
      toast.success("Cập nhật hợp đồng thành công");
      handleSubmit();
    } catch (err) {
      console.error(err);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {status === "PENDING" ? (
          <Button type="button" variant="default">Cập nhật</Button>
        ) : (
          <Button type="button" variant="destructive">Chấp thuận</Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {status === "PENDING" ? "Cập nhật hợp đồng" : "Chấp thuận hợp đồng" }
          </AlertDialogTitle>
          <AlertDialogDescription>
            {status === "PENDING" 
            ? "Bạn có chắc chắn muốn cập nhật hợp đồng này ?"
            : "Chấp thuận hợp đồng ? Lưu ý rằng mọi chỉnh sửa lần này cuả bạn sẽ không được lưu, nội dung hợp đồng sẽ được cố định." }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Đồng ý</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  );
}