import { Card } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { RentalComplaint } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";

type Data = {
  requests: RentalComplaint[];
};
export default function MaintenanceRequests({
  sessionData
} : {
  sessionData: Session;
}) {
  const query = useQuery<Data>({
    queryKey: ["manage", "statistic", "maintenance", sessionData!.user.accessToken],
    queryFn: async ({queryKey}) => {
      const res = (await backendAPI.get<Data>("/api/statistics/rentals", {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
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

  return (
    <Card>

    </Card>
  );
};
