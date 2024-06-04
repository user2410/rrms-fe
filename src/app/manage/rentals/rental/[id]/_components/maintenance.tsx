import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { RentalComplaint } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { useDataCtx } from "../_context/data.context";
import ComplaintItem from "./maintenance/complaint_item";
import CreateComplaintDialog from "./maintenance/create_complaint_dialog";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const PAGE_SIZE = 5;

export default function Maintenance() {
  const { 
    isSideA: _isSideA, 
    sessionData, rental, 
  } = useDataCtx();
  const [limit, setLimit] = useState<number>(PAGE_SIZE);
  const [offset, setOffset] = useState<number>(0);
  const query = useQuery<RentalComplaint[]>({
    queryKey: ["manage", "rentals", "rental", rental.id, 'complaints', limit, offset, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<RentalComplaint[]>(`/api/rental-complaints/rental/${queryKey.at(3)}`, {
        params: {
          limit: queryKey.at(5),
          offset: queryKey.at(6),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
        },
      })).data;
      if(!res) {
        return [];
      }
      return res.map(r => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
        occurredAt: new Date(r.occurredAt),
      }));
    },
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-lg">Báo cáo / đề xuất</CardTitle>
        <div className="flex flex-row items-center gap-2">
          <Button
            variant="outline"
            disabled={query.isLoading}
            onClick={() => query.refetch()}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Tạo</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[40vw]">
              <CreateComplaintDialog rentalId={rental.id} sessionData={sessionData}/>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {query.isLoading ? (
          <Spinner size={16} />
        ) : query.isError ? (
          <p className="w-full text-center text-sm font-light">Đã có lỗi xảy ra</p>
        ) : query.data.length === 0 ? (
          <p className="w-full text-center text-sm font-light">Không có báo cáo nào</p>
        ) : (
          <>
            {query.data.slice(offset * PAGE_SIZE).map((item, index) => (
              <ComplaintItem item={item} key={index}/>
            ))}
            <div className="flex flex-row justify-center gap-2">
              <Button
                variant="outline"
                disabled={offset === 0}
                onClick={() => setOffset(v => (v - limit))}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                disabled={offset === Math.floor(query.data.length / PAGE_SIZE)}
                onClick={() => setOffset(v => (v + limit))}
              >
                Sau
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
