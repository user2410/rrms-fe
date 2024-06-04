"use client";

import Empty from "@/components/complex/empty";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { RentalComplaint } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import ComplaintItem from "./_components/complaint_item";
import CreateComplaintDialog from "../rental/[id]/_components/maintenance/create_complaint_dialog";

export default function ReportsPage() {
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const session = useSession();
  const query = useQuery<RentalComplaint[]>({
    queryKey: ["manage", "rentals", "reports", limit, offset, session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const res = (await backendAPI.get<RentalComplaint[]>("/api/rental-complaints", {
        params: {
          limit: queryKey.at(3),
          offset: queryKey.at(4),
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
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <div className="container h-full py-10">
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
              <AlertDialogTrigger>
                <Button>Tạo</Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[40vw]">
                {session.status === "authenticated" && (
                  <CreateComplaintDialog sessionData={session.data} />
                )}
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
              {query.data.slice(offset * limit).map((item, index) => (
                <ComplaintItem item={item} key={index} sessionData={session.data!} />
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
                  disabled={offset === Math.floor(query.data.length / limit)}
                  onClick={() => setOffset(v => (v + limit))}
                >
                  Sau
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

