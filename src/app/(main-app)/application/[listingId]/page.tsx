'use client';

import Loading from "@/components/ui/loading";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import MainForm from "./_components/main_form";

export type ListingDetail = {
  listing: Listing;
  property: Property;
  units: Unit[];
};

export type Query = {
  fullName: string;
  email: string;
  phone: string;
  unitId: string;
  k: string;
}

export default function ApplicationPageWrapper({ params: { listingId } }: { params: { listingId: string } }) {
  const searchParams = useSearchParams();

  return searchParams && (
    <ApplicationPage
      listingId={listingId}
      _q={{
        fullName: searchParams.get('fullName') || '',
        email: searchParams.get('email') || '',
        phone: searchParams.get('phone') || '',
        unitId: searchParams.get('unit') || '',
        k: searchParams.get('k') || '',
      }}
    />
  );
}

function ApplicationPage({
  listingId,
  _q,
}: {
  listingId: string;
  _q: Query;
}) {
  const session = useSession();
  const [q, setQuery] = useState<Query>(_q);

  useEffect(() => {
    (async () => {
      if((_q.email || _q.fullName || _q.phone) && _q.k) {
        try {
          await backendAPI.get(`/api/listings/listing/${listingId}/application-link`, {
            params: _q,
          });
        } catch(err) {
          console.error(err);
          throw new Error("Invalid application link");
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (session.status !== "authenticated") return;
    const user = session.data.user.user;
    setQuery(v => ({
      ...v,
      fullName: user.firstName + ' ' + user.lastName,
      email: user.email,
      phone: user.phone,
    }));
  }, [session.status]);

  const query = useQuery<ListingDetail>({
    queryKey: ['application', 'listing', session.data?.user.user.id, listingId],
    queryFn: async ({ queryKey }) => {
      const userId = queryKey.at(2) as string;
      const listingId = queryKey.at(3) as string;

      const listing = (await backendAPI.get<Listing>(`/api/listings/listing/${listingId}`)).data;
      const property = (await backendAPI.get<Property>(`/api/properties/property/${listing.propertyId}`)).data;
      if (property.managers.map(m => m.managerId).includes(userId)) {
        throw new Error("You cannot to apply to this property");
      }
      const units = (await backendAPI.get<Unit[]>('/api/units/ids', {
        params: {
          unitIds: listing.units.map((u) => u.unitId),
          fields: "name,floor,area"
        }
      })).data;
      return {
        listing,
        property: property,
        units: units,
      };
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return query.isLoading ? (
    <Loading />
  ) : query.isError ? (
    <div>Error {JSON.stringify(query.error)}</div>
  ) : q && (
    <MainForm
      data={query.data!}
      query={q}
    />
  );
}
