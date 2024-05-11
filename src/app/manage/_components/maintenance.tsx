import { backendAPI } from "@/libs/axios";
import { useQuery } from "@tanstack/react-query";
import StatCard from "./stat-card";
import Link from "next/link";
import Spinner from "@/components/ui/spinner";
import { Session } from "next-auth";
import { Card } from "@/components/ui/card";

type Data = {
  newMaintenancesThisMonth: number[];
  newMaintenancesLastMonth: number[];
};

export default function Maintenance({
  sessionData
}: {
  sessionData: Session;
}) {
  const query = useQuery<Data>({
    queryKey: ["manage", "statistic", "maintenance"],
    queryFn: async () => {
      const res = (await backendAPI.get<Data>("/api/statistics/rentals", {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
      })).data;
      return res;
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

  // compare numbers of new maintenances this month and last month, change is calculated by percentage
  const thisMonth = query.data.newMaintenancesThisMonth?.length || 0;
  const lastMonth = query.data.newMaintenancesLastMonth?.length || 0;
  const change = lastMonth > 0 ? (thisMonth - lastMonth) / lastMonth * 100 : 0;

  return (
    <Link href="/">
      <StatCard
        title="Yêu cầu bảo trì"
        icon={<i className="fas fa-screwdriver-wrench" />}
        data={thisMonth.toString() || "0"}
        statArrow={change > 0 ? "up" : change < 0 ? "down" : "none"}
        change={change > 0 ? change.toString() : ""}
        since="Từ tháng trước"
      />
    </Link>
  );
};
