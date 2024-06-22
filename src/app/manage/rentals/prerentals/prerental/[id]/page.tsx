"use client";

import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import PrerentalView from "./_components/prerental_view";

type Data = {
  preRental: Rental;
  property: Property;
  unit: Unit;
};

export default function PreRentalDetailPage({ params: { id } }: { params: { id: string } }) {
  const session = useSession();

  const query = useQuery<Data>({
    queryKey: ["manage", "rentals", "prerental", id, session.data?.user.accessToken],
    queryFn: async ({ queryKey }) => {
      return (await backendAPI.get<Data>("/api/prerentals/prerental/" + id, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`
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
          sessionData={session.status === "authenticated" ? session.data : undefined}
        />
      )}
    </div>
  );
};

