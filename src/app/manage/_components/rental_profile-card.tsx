import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ManagedRental } from "../rentals/page";
import { Session } from "next-auth";
import { backendAPI } from "@/libs/axios";
import { Rental } from "@/models/rental";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { addMonths } from "date-fns";
import Spinner from "@/components/ui/spinner";
import { DataTable } from "../rentals/_components/data_table";
import { aboutToExpireColumns } from "../rentals/_components/column";
import { IconBadge } from "@/components/ui/icon-badge";
import { File as FileIcon } from "lucide-react";

export default function RentalProfileCard({
  sessionData,
}: {
  sessionData: Session;
}) {
  const query = useQuery<ManagedRental[]>({
    queryKey: ["managed", "rentals", "managed-rentals", "nonexpired", 100, 0, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const rentals = (await backendAPI.get<Rental[]>(`/api/rentals/${queryKey.at(2)}`, {
        params: {
          fields: "property_id,unit_id,tenant_id,tenant_name,tenant_email,tenant_phone,profile_image,organization_name,start_date,movein_date,rental_period",
          limit: queryKey.at(4),
          offset: queryKey.at(5),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      if (rentals.length === 0) {
        return [] as ManagedRental[];
      }
      const propIds = new Set<string>();
      rentals.forEach((rental) => propIds.add(rental.propertyId));
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "name",
          propIds: [...propIds],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      const unitIds = new Set<string>();
      rentals.forEach((rental) => unitIds.add(rental.unitId));
      const units = (await backendAPI.get<Unit[]>("/api/units/ids", {
        params: {
          fields: "name",
          unitIds: [...unitIds],
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      return rentals
        .map((rental) => {
          const property = properties.find((property) => property.id === rental.propertyId);
          const unit = units.find((unit) => unit.id === rental.unitId);
          const expiryDate = addMonths(new Date(rental.startDate), rental.rentalPeriod);
          return ({
            rental: {
              ...rental,
              startDate: new Date(rental.startDate),
              moveinDate: new Date(rental.moveinDate),
              expiryDate,
              timeLeft: ((expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
            },
            property,
            unit,
          }) as ManagedRental;
        })
        .sort((a, b) => a.rental.timeLeft - b.rental.timeLeft);
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center gap-2">
          <IconBadge icon={FileIcon} variant="success"/>
          <CardTitle className="text-lg">Hợp đồng thuê nhà</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {query.isLoading ? (
          <div className="w-full flex flex-row justify-center">
            <Spinner size={32} />
          </div>
        ) : query.isError ? (
          <div className="w-full flex flex-row justify-center">
            <div className="text-red-500">Lỗi khi tải dữ liệu</div>
          </div>
        ) : (
          query.data.length > 0 ? (
            <DataTable
              columns={aboutToExpireColumns.slice(0, aboutToExpireColumns.length - 1)}
              data={query.data.slice(0, 5)}
            />
          ) : (
            <div className="w-full flex flex-row justify-center">
              <div className="text-gray-500">Không có hợp đồng thuê nào</div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};
