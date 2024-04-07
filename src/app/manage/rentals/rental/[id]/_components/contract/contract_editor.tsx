import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { backendAPI } from "@/libs/axios";
import { Contract } from "@/models/contract";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDataCtx } from "../../_context/data.context";
import Editor from "./editor";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";

export default function ContractEditorWrapper() {
  const data = useDataCtx();

  const query = useQuery<Contract>({
    queryKey: ["manage", "rentals", "rental", data.rental.id, "contract"],
    queryFn: async () => {
      return (await backendAPI.get<Contract>(`/api/rentals/rental/${data.rental.id}/contract`, {
        headers: {
          Authorization: `Bearer ${data.sessionData.user.accessToken}`
        }
      })).data;
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60,
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
      refresh={() => query.refetch()}  
    />
  );
}

function ContractEditor({
  contract,
  refresh,
} : {
  contract: Contract;
  refresh: () => void;
}) {
  const {sessionData} = useDataCtx();
  const [value, setValue] = useState<string>(contract.content);

  function reset() {
    setValue(contract.content);
  }

  async function handleUpdate(status: "PENDING" | "SIGNED") {
    try {
      await backendAPI.patch(`/api/contracts/contract/${contract.id}/content`, {
        id: contract.id,
        content: value ,
        status: status,
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
    <Dialog onOpenChange={(open) => {
      if(open) {refresh();}
    }}>
      <DialogTrigger>
        <Button type="button">Chỉnh sửa hợp đồng</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa hợp đồng</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <Editor value={value} onChange={setValue}/>
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
            <Button type="submit" className="float-right" onClick={() => handleUpdate("PENDING")}>Cập nhật</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" variant="destructive" className="float-right" onClick={() => handleUpdate("SIGNED")}>Chấp thuận</Button>
          </DialogClose>
        </DialogFooter>
        </DialogContent>
    </Dialog>
  );
};
