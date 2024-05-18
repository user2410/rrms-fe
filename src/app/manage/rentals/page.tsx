"use client";

import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Rental } from "@/models/rental";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Unit } from "@/models/unit";
import { Property } from "@/models/property";
import { DataTable } from "./_components/data_table";
import { aboutToExpireColumns, endColumns, nonExpireColumns } from "./_components/column";
import { addMonths } from "date-fns";

export type ManagedRental = {
  rental: Rental & { timeLeft: number };
  property: Property;
  unit: Unit;
}

export default function ManagedRentalsPage() {
  const router = useRouter();
  const session = useSession();
  const query = useQuery<ManagedRental[]>({
    queryKey: ["managed", "rentals", "managed-rentals"],
    queryFn: async () => {
      const rentals = (await backendAPI.get<Rental[]>("/api/rentals/managed-rentals", {
        params: {
          fields: "property_id,unit_id,tenant_id,tenant_name,tenant_email,tenant_phone,profile_image,organization_name,start_date,movein_date,rental_period",
        },
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
        }
      })).data || ([]);
      const propIds = new Set<string>();
      rentals.forEach((rental) => propIds.add(rental.propertyId));
      const properties = (await backendAPI.get<Property[]>("/api/properties/ids", {
        params: {
          fields: "name",
          propIds: [...propIds],
        },
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
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
          Authorization: `Bearer ${session.data?.user.accessToken}`,
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
    enabled: !!session.data?.user.accessToken,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl lg:text-3xl font-light">Quản lý thuê</h1>
          <Button type="button" variant="default" onClick={() => router.push('/manage/rentals/new')}>Thêm người thuê mới</Button>
        </div>
        {query.isLoading
          ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner size={32} />
            </div>
          ) : query.isError ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">Đã có lỗi xảy ra</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(() => {
                const rentals = query.data.
                filter((item) => item.rental.timeLeft < 60).
                sort((a, b) => {
                  return a.rental.timeLeft - b.rental.timeLeft;
                });
                return rentals.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg">Lượt thuê sắp hết hạn</h3>
                    <DataTable 
                      columns={aboutToExpireColumns} 
                      data={rentals}
                    />
                  </div>
                );
              })()}
              <div className="space-y-3">
                <h3 className="text-lg">Khách đang thuê</h3>
                <DataTable 
                  columns={nonExpireColumns} 
                  data={query.data.
                    filter((item) => item.rental.timeLeft >= 0 || item.rental.status === "INPROGRESS").
                    sort((a, b) => a.rental.startDate.
                    getTime() - b.rental.startDate.getTime())
                  }
                />
              </div>
              <div className="space-y-3">
                <h3 className="text-lg">Lượt thuê đã kết thúc</h3>
                <DataTable 
                  columns={endColumns} 
                  data={query.data.
                    filter((item) => item.rental.timeLeft < 0 || item.rental.status === "END").
                    sort((a, b) => a.rental.startDate.
                    getTime() - b.rental.startDate.getTime())
                  }
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
