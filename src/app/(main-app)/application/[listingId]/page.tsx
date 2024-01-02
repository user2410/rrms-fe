'use client';

import Loading from "@/components/ui/loading";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Layout from "./_components/layout";
import MainForm from "./_components/main_form";

function MainContent({ listingId }: { listingId: string }) {
  const [data, setData] = useState<{listing: Listing; property: Property; units: Unit[]}>();
  const [unitIds, setUnitIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    if(unitIds.length === 0) return;
    (async () => {
      try {
        setLoading(true);
        const listingQuery = await backendAPI.get(`/api/listings/listing/${listingId}`);
        const listing = listingQuery.data;
        console.log('listing', listing);
        const propertyQuery = await backendAPI.get(`/api/properties/property/${listing.propertyId}`);
        const unitsQuery = await backendAPI.get(`/api/units/property/${listing.propertyId}`);
        setData({
          listing,
          property: propertyQuery.data,
          units: unitsQuery.data.items.filter((unit: Unit) => unitIds.includes(unit.id)),
        });
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [unitIds]);

  useEffect(() => {
    if (!searchParams) {
      throw new Error("No search params");
    }
    const unitsQuery = searchParams.get('units');
    if (!unitsQuery) {
      throw new Error("Missing units param");
    }
    const uIds = unitsQuery.split(',');
    if (uIds.length === 0) {
      throw new Error("No units selected");
    }
    setUnitIds(uIds);
  }, [searchParams]);

  return loading ? (
    <Loading />
  ) : error ? (
    <div>Error {JSON.stringify(error)}</div>
  ) : (
    <Layout listing={data!.listing} property={data!.property}>
      <MainForm listingId={listingId} property={data!.property} units={data!.units}/>
    </Layout>
  );

}

export default function ApplicationPage({ params }: { params: { listingId: string } }) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === 'loading') return;
    if (session.status === 'unauthenticated') {
      console.log('unauthenticated');
      router.replace('/');
    }
  }, [session.status, router]);

  return session.status === 'loading' ? (
    <Loading />
  ) : session.status === 'unauthenticated' ? (
    <div>Unauthenticated</div>
  ) : (
    <MainContent listingId={params.listingId} />
  );
}
