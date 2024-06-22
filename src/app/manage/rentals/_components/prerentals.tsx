import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import { Session } from "next-auth";
import { useState } from "react";
import { ManagedRental } from "../page";
import { prerentalColumns } from "./column";
import { DataTable } from "./data_table";

export default function Prerentals({
  segment,
  sessionData,
}: {
  segment: "to-me" | "managed";
  sessionData: Session;
}) {
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);

  const query = useQuery<ManagedRental[]>({
    queryKey: ["managed", "rentals", "prerentals", segment, limit, offset, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      const rentals = (await backendAPI.get<Rental[]>(`/api/prerentals/${queryKey.at(3)}`, {
        params: {
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
  });

  return (
    <div className="space-y-3">
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
          columns={prerentalColumns}
          data={query.data}
        />
      )}
    </div>
  );
};
