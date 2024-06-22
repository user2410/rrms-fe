"use client";

import PrerentalView from "@/app/manage/rentals/prerentals/prerental/[id]/_components/prerental_view";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

type Data = {
  preRental: Rental;
  property: Property;
  unit: Unit;
};

export default function PreRentalDetailPageWrapper({ params: { id } }: { params: { id: string } }) {
  const searchParams = useSearchParams();
 
  const key = searchParams?.get('key');
  if(!key) {
    return null;
  }

  return (
    <PreRentalDetailPage id={id} key={key} />
  );
};

function PreRentalDetailPage({
  id,
  key,
} : {
  id: string;
  key: string;
}) {
  const query = useQuery<Data>({
    queryKey: ["lobby", "rentals", "prerental", id, key],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<Data>(`/api/prerentals/prerental/${queryKey.at(3)}`, {
        params: {
          key: queryKey.at(4)
        },
      })).data;
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <div className="container h-full py-10">
      {query.isLoading ? (
        <div className="flex flex-row justify-center">
          <Spinner size={32} />
        </div>
      ) : query.isError ? (
        <div className="flex flex-row justify-center">
          <p className="text-red-500">Đã xảy ra lỗi khi tải dữ liệu</p>
        </div>
      ) : (
        <PrerentalView 
          preRental={query.data.preRental}
          property={query.data.property}
          unit={query.data.unit}
          key={key}
        />
      )}
    </div>
  );
}