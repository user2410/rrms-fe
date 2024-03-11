"use client";

import { Button } from "@/components/ui/button";
import { backendAPI } from "@/libs/axios";
import { Payment } from "@/models/payment";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SuccessPage({ params: { id } }: { params: { id: string } }) {
  const session = useSession();
  const router = useRouter();

  const query = useQuery<Payment>({
    queryKey: ["manage", "payment", id],
    queryFn: async () => {
      return (await backendAPI.get<Payment>("/api/payments/payment/" + id, {
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`
        },
      })).data;
    },
    enabled: session.status === "authenticated",
  });

  return (
    <div className="container h-full pt-10">
      {query.isLoading ? (
        <div>Loading...</div>
      ) : query.isError ? (
        <div>{JSON.stringify(query.error)}</div>
      ) : (() => {
        const p = query.data!;
        return p.status === "PENDING" ? (
          <div className="flex flex-col items-center gap-3">
            <div className="font-bold">Đang thực hiện giao dịch</div>
            <p className="text-sm font-light"> Vui lòng đợi trong giây lát...</p>
            <div className="mt-5">
              <Button variant="outline" onClick={() => query.refetch()}>
                <RefreshCcw />
              </Button>
            </div>
          </div> 
        ) : p.status === "SUCCESS" ? (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">Thanh toán thành công</div>
            <div className="mt-5">
              <div className="text-lg">Mã hóa đơn: {query.data?.id}</div>
              <div className="text-lg">Số tiền: {query.data?.amount}</div>
              <div className="text-lg">Ngày thanh toán: {new Date(query.data?.updatedAt).toLocaleDateString("vi-VN")} {new Date(query.data?.updatedAt).toLocaleTimeString("vi-VN")}</div>
            </div>
          </div> 
        ) : p.status === "FAILED" ? (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold">Giao dịch thất bại</div>
            <div className="mt-5">
              <Button 
                variant="outline" 
                onClick={() => router.push("/manage/payment/" + id)}
                className="flex flex-row items-center gap-2"
              >
                <ArrowLeft /> Thử lại
              </Button>
            </div>
          </div> 
        ) : null;
      })()}
    </div>
  );
};
