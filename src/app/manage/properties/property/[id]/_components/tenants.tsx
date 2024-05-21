import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TenantTable from "./tenant/tenant-table";
import { tenantTColumns } from "./tenant/tenant-table_columns";
import { Button } from "@/components/ui/button";
import { Rental } from "@/models/rental";
import { usePropDataCtx } from "../_context/property_data.context";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import CreateTenantDialog from "./tenant/create-tenant_dialog";
import { useQuery } from "@tanstack/react-query";
import { backendAPI } from "@/libs/axios";
import Spinner from "@/components/ui/spinner";

export type RentalExtended = Rental & {
  property: Property;
  unit: Unit;
}

export default function Tenants() {
  const {property, units, sessionData} = usePropDataCtx();

  const activeRentalsQuery = useQuery<Rental[]>({
    queryKey: ["manage", "properties", "property", property.id, "rentals", "active", sessionData?.user.accessToken],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<Rental[]>(
        `/api/properties/property/${queryKey.at(3)}/rentals`,
        {
          params: {
            expired: false,
            fields: "unit_id,tenant_id,profile_image,tenant_type,tenant_name,start_date,movein_date,rental_period"
          },
          headers: {
            Authorization: `Bearer ${queryKey.at(-1)}`
          }
        }
      )).data || ([]);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const expiredRentalsQuery = useQuery<Rental[]>({
    queryKey: ["manage", "properties", "property", property.id, "rentals", "not-active", sessionData?.user.accessToken],
    queryFn: async ({queryKey}) => {
      return (await backendAPI.get<Rental[]>(
        `/api/properties/property/${queryKey.at(3)}/rentals`,
        {
          params: {
            expired: true,
            fields: "unit_id,tenant_id,profile_image,tenant_type,tenant_name,start_date,movein_date,rental_period"
          },
          headers: {
            Authorization: `Bearer ${queryKey.at(-1)}`
          }
        }
      )).data || ([]);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center">
        <CardTitle>Lượt thuê nhà</CardTitle>
        <CreateTenantDialog/>
      </CardHeader>
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lượt thuê hiện tại</CardTitle>
          </CardHeader>
          <CardContent>
            {activeRentalsQuery.isLoading ? (
              <div className="w-full flex flex-row justify-center">
                <Spinner size={32}/>
              </div>
            ) : activeRentalsQuery.isError ? (
              <div className="w-full flex flex-row justify-center">
                <span className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</span>
              </div>
            ) : activeRentalsQuery.isSuccess && (
              <TenantTable 
                columns={tenantTColumns} 
                data={activeRentalsQuery.data.map(item => ({
                  ...item,
                  property: property,
                  unit: units.find(unit => unit.id === item.unitId)!,
                }))}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lịch sử thuê</CardTitle>
          </CardHeader>
          <CardContent>
            {expiredRentalsQuery.isLoading ? (
              <div className="w-full flex flex-row justify-center">
                <Spinner size={32}/>
              </div>
            ) : expiredRentalsQuery.isError ? (
              <div className="w-full flex flex-row justify-center">
                <span className="text-red-500">Có lỗi xảy ra khi tải dữ liệu</span>
              </div>
            ) : expiredRentalsQuery.isSuccess && (
              <TenantTable 
                columns={tenantTColumns} 
                data={expiredRentalsQuery.data.map(item => ({
                  ...item,
                  property: property,
                  unit: units.find(unit => unit.id === item.unitId)!,
                }))}
              />
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
