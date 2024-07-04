
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useDataCtx } from "../_context/data.context";
import ContractEditor from "./contract/contract_editor";
import CreateContractA from "./contract/create_contract_a";
import CreateContractB from "./contract/create_contract_b";
import ViewContract from "./contract/view_contract";

type ContractPingData = {
  id: number;
  rentalId: number;
  status: 'PENDING_A' | 'PENDING_B' | 'PENDING' | 'SIGNED';
  updatedAt: Date;
  updatedBy: string;
};

export default function ContractCard() {
  const { sessionData, rental } = useDataCtx();

  const query = useQuery<ContractPingData | null>({
    queryKey: ["manage", "rentals", "rental", rental.id, "ping-contract", sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const res = await backendAPI.get<ContractPingData>(`/api/rentals/rental/${rental.id}/ping-contract`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
        validateStatus: (status) => status === 200 || status === 404,
      });
      if (res.status === 404) {
        return null;
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-lg">Hợp đồng</CardTitle>
          <Button type="button" variant="outline" onClick={() => query.refetch()} disabled={query.isLoading}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2>Hợp đồng thuê nhà</h2>
          {query.isLoading ? (
            <div className="flex flex-row justify-center">
              <Spinner size={16} />
            </div>
          ) : query.isError ? (
            <div className="flex flex-row justify-center">
              <span className="text-red-500">Lỗi khi tải hợp đồng</span>
            </div>
          ) : query.data ? (
            <ContractItem
              item={query.data!}
              onSubmit={query.refetch}
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <p className="text-center text-sm font-light">Chưa có hợp đồng</p>
              {sessionData.user.user.id !== rental.tenantId && (
                <CreateContractA handleSubmit={query.refetch} />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function ContractItem({
  item,
  onSubmit,
}: {
  item: ContractPingData;
  onSubmit: () => void;
}) {
  const { sessionData, rental, property } = useDataCtx();

  function isSideA(id: string) {
    return property.managers.filter(m => m.managerId === id).length > 0;
  }

  return item.status === 'SIGNED' ? (
    <div className="flex flex-row justify-center">
      <ViewContract />
    </div>
  ) : item.status === 'PENDING_A' ? (
    isSideA(sessionData.user.user.id) ? (
      <div className="flex flex-col justify-center items-center gap-2">
        <p className="text-center text-base font-light text-gray-400">Đang chờ bên B bổ sung thông tin</p>
        <Button type="button" variant="outline">Xem chi tiết</Button>
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center gap-2">
        <p className="text-sm font-light">Bổ sung thông tin vào hợp đồng</p>
        <CreateContractB contractId={item.id} handleSubmit={onSubmit}/>
      </div>
    )
  ) : item.status === 'PENDING' ? (
    <div className="flex flex-row justify-center gap-2">
      {isSideA(sessionData.user.user.id) ? (
        isSideA(item.updatedBy) ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-light">Đang chờ bên B xem xét và phê duyệt</p>
            {/* <Button type="button" variant="outline">Xem chi tiết</Button> */}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ContractEditor handleSubmit={onSubmit}/>
          </div>
        )
      ) : (
        item.updatedBy === sessionData.user.user.id ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm font-light">Đang chờ bên A xem xét và phê duyệt</p>
            {/* <Button type="button" variant="outline">Xem chi tiết</Button> */}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <ContractEditor handleSubmit={onSubmit}/>
          </div>
        )
      )}
    </div>
  ) : null;
}
