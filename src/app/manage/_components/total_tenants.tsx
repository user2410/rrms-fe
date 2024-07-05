import { backendAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import StatCard from "./stat-card";
import Link from "next/link";
import Spinner from "@/components/ui/spinner";
import { Session } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Data = {
  allTime: number;
  thisMonth: number;
}

export default function TotalTenants({
  sessionData
}: {
  sessionData: Session;
}) {

  const query = useQuery<Data>({
    queryKey: ["manage", "statistic", "tenants", sessionData!.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const thisMonth = (await backendAPI.get("/api/statistics/manager/tenants", {
        params: {
          startTime: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
          endTime: new Date().toISOString(),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
      const allTime = (await backendAPI.get("/api/statistics/manager/tenants", {
        params: {
          startTime: new Date(0).toISOString(),
          endTime: new Date().toISOString(),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
      return { allTime: allTime.total, thisMonth: thisMonth.total };
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  if (query.isLoading) {
    return (
      <Card className="flex flex-row justify-center items-center">
        <Spinner size={32} />
      </Card>
    );
  }

  if (query.isError) {
    return (
      <Card className="flex flex-row justify-center items-center">
        <div className="text-red-500">Lỗi khi tải dữ liệu</div>
      </Card>
    );
  }

  return (
    <Link href="/manage/rentals">
      {query.isLoading ? (
        <Spinner size={32} />
      ) : query.isError ? (
        <div className="text-red-500">Lỗi khi tải dữ liệu</div>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số người đang thuê nhà
            </CardTitle>
            <i className="fas fa-user" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{query.data.allTime}</div>
            <div className="inline-block space-x-1 text-emerald-500">
              <i className="fas fa-arrow-up" />
              <span className="text-xs text-muted-foreground">{query.data.thisMonth} người thuê mới</span>
            </div>
          </CardContent>
        </Card>
      )}
    </Link>
  );
};
