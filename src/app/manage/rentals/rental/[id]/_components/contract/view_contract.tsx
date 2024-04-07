import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { backendAPI } from "@/libs/axios";
import { Contract } from "@/models/contract";
import { useQuery } from "@tanstack/react-query";
import printContract from "../../_actions/print_contract";
import { useDataCtx } from "../../_context/data.context";

import "../../_styles/quill.css";

export default function ViewContractWrapper() {
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
    <ContractViewer
      contract={query.data}
      refresh={() => query.refetch()}
    />
  );
}

function ContractViewer({
  contract,
  refresh,
}: {
  contract: Contract;
  refresh: () => void;
}) {
  return (
    <Dialog onOpenChange={(open) => {
      if(open) {refresh();}
    }}>
      <DialogTrigger>
        <Button type="button">Xem chi tiết hợp đồng</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] lg:max-w-[960px] xl:max-w-[1024px] 2xl:max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Xem chi tiết hợp đồng</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: contract.content }} />
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
          <Button type="button" variant="outline" onClick={() => printContract(contract.content)}>In hợp đồng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
