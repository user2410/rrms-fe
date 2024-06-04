import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import { Session } from "next-auth";
import { ManagedRental } from "../page";
import { endColumns } from "./column";
import { DataTable } from "./data_table";
import { useState } from "react";

export default function Expired({
  segment,
  sessionData,
}: {
  segment: string;
  sessionData: Session;
}) {
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const query = useQuery<ManagedRental[]>({
    queryKey: ["managed", "rentals", segment, "expired", limit, offset, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const rentals = (await backendAPI.get<Rental[]>(`/api/rentals/${queryKey.at(2)}`, {
        params: {
          fields: "property_id,unit_id,tenant_id,tenant_name,tenant_email,tenant_phone,profile_image,organization_name,start_date,movein_date,rental_period",
          expired: true,
          limit: queryKey.at(4), 
          offset: queryKey.at(5),
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || ([]);
      if(rentals.length === 0) {
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
      return rentals.map((rental) => {
        const property = properties.find((property) => property.id === rental.propertyId);
        const unit = units.find((unit) => unit.id === rental.unitId);
        return ({
          rental: {
            ...rental,
            startDate: new Date(rental.startDate),
            moveinDate: new Date(rental.moveinDate),
            expiryDate: addMonths(new Date(rental.startDate), rental.rentalPeriod),
            timeLeft: ((addMonths(new Date(rental.startDate), rental.rentalPeriod).getTime() - Date.now()) / (24 * 60 * 60 * 1000)),
          },
          property,
          unit,
        }) as ManagedRental;
      });
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <div className="space-y-3">
      <h3 className="text-lg">Lượt thuê đã kết thúc</h3>
      {query.isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner size={32} />
        </div>
      ) : query.isError ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-red-500">Đã có lỗi xảy ra</p>
        </div>
      ) : (
        <DataTable
          columns={endColumns}
          data={query.data}
        />
      )}
    </div>
  );

};
