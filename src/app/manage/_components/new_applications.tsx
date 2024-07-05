import { backendAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import StatCard from "./stat-card";
import Link from "next/link";
import Spinner from "@/components/ui/spinner";
import { Session } from "next-auth";
import { Card } from "@/components/ui/card";

type Data = {
  newApplicationsThisMonth: number[];
  newApplicationsLastMonth: number[];
}

export default function NewApplications({
  sessionData
}: {
  sessionData: Session;
}) {

  const query = useQuery<Data>({
    queryKey: ["manage", "statistic", "applications", sessionData!.user.accessToken],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<Data>("/api/statistics/manager/applications", {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ({
        newApplicationsThisMonth: [],
        newApplicationsLastMonth: [],
      } as Data);
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

  const thisMonth = query.data.newApplicationsThisMonth?.length || 0;
  const lastMonth = query.data.newApplicationsLastMonth?.length || 0;
  const change = lastMonth > 0 ? (thisMonth - lastMonth) : (lastMonth - thisMonth);
  console.log("change", change);
  return (
    <Link href="/manage/applications/to-me">
      {query.isLoading ? (
        <Spinner size={32} />
      ) : query.isError ? (
        <div className="text-red-500">Lỗi khi tải dữ liệu</div>
      ) : (
        <StatCard
          title="Đơn ứng tuyển mới"
          icon={<i className="fas fa-file-lines" />}
          data={thisMonth.toString() || "0"}
          statArrow={change > 0 ? "up" : change < 0 ? "down" : "none"}
          change={change !== 0 ? change.toString() : ""}
          since="So với tháng trước"
        />
      )}
    </Link>
  );
};
