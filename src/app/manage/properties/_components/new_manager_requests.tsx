import { backendAPI } from "@/libs/axios";
import { NewPropertyManagerRequest, Property } from "@/models/property";
import { User } from "@/models/user";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import { DataTable } from "./data_table";
import { approvedRequestColumns, newRequestColumns } from "./request_column";

export type ManagedNewPropertyManagerRequest = {
  request: NewPropertyManagerRequest;
  property: Property;
  creator: User;
};

export default function NewManagerRequests({
  sessionData,
} : {
  sessionData: Session;
}) {
  const query = useQuery<ManagedNewPropertyManagerRequest[]>({
    queryKey: ['manage', 'properties', 'new-manager-requests', sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const requests = (await backendAPI.get<NewPropertyManagerRequest[]>("api/properties/new-manager-requests", {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      const properties = (await backendAPI.get<Property[]>('/api/properties/ids', {
        params: {
          propIds: requests.map(r => r.propertyId),
          fields: "name,full_address,city,district,ward,area,media,primary_image",
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      const users =  (await backendAPI.get<User[]>('/api/auth/credential/ids', {
        params: {
          ids: requests.map(r => r.creatorId),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data || ([]);
      return requests.map(r => ({
        request: {
          ...r,
          createdAt: new Date(r.createdAt),
        },
        property: properties.find(p => p.id === r.propertyId)!,
        creator: users.find(u => u.id === r.creatorId)!,
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 5, // 5 minutes
  });

  return query.isLoading ? (
    <div></div>
  ) : query.isError ? (
    <div>Đã có lỗi xảy ra</div>
  ) : (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Yêu cầu mới</h3>
        <DataTable
          columns={newRequestColumns(sessionData, query.refetch)}
          data={query.data!.filter(r => !r.request.approved)}
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Yêu cầu chấp thuận</h3>
        <DataTable
          columns={approvedRequestColumns}
          data={query.data!.filter(r => r.request.approved)}
        />
      </div>
    </div>
  );
};
