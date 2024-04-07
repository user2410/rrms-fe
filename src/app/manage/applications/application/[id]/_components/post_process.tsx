import { Button } from "@/components/ui/button";
import { backendAPI } from "@/libs/axios";
import { ManagedApplication } from "@/models/application";
import { Rental } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

export default function PostProcess({
  data,
  sessionData,
}: {
  data: ManagedApplication;
  sessionData: Session;
}) {
  const router = useRouter();
  const { application, property, unit } = data;

  const query = useQuery<Rental | null>({
    queryKey: ["manage", "rentals", "rental", data.application.id, "rental"],
    queryFn: async ({ queryKey }) => {
      const res = await backendAPI.get<Rental>(`/api/applications/application/${queryKey.at(3)}/rental`, {
        headers: {
          Authorization: `Bearer ${sessionData.user.accessToken}`,
        },
        validateStatus: (status) => status === 200 || status === 404,
      });
      if (res.status === 404) {
        return null;
      }
      return res.data;
    },
    staleTime: 1000 * 60, // 1 minute polling
    cacheTime: 1000 * 60, // 1 minute polling
  });

  return query.isSuccess && (
    query.data ? (
      <Button type="button" onClick={() => router.push(`/manage/rentals/rental/${query.data!.id}`)}>
        Quản lý thuê nhà
      </Button>
    ) : (
      <Button type="button" onClick={() => router.push(`/manage/rentals/new/?applicationId=${application.id}&propertyId=${property.id}&unitId=${unit.id}`)}>
        Tạo hồ sơ quản lý thuê nhà
      </Button>
    )
  );
};
