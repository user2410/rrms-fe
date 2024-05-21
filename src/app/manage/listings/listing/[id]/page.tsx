"use client";

import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Listing, ManagedListing } from "@/models/listing";
import * as Tabs from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import ListingDetail from "./_components/listing-detail";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import TopCard from "./_components/top_card";
import PropUnits from "./_components/prop_units";
import Policies from "./_components/policies";
import Billings from "./_components/billings";
import { DataProvider, useDataCtx } from "./_context/data.context";
import { useEffect } from "react";
import { Session } from "next-auth";

export default function ListingPageWrapper({ params: { id } }: { params: { id: string } }) {
  const session = useSession();
  const query = useQuery<ManagedListing>({
    queryKey: ["manage", "listings", "listing", id, session.data?.user.accessToken],
    queryFn: async ({queryKey}) => {
      const listing = (await backendAPI.get<Listing>(`/api/listings/listing/${id}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      const property = (await backendAPI.get<Property>(`/api/properties/property/${listing.propertyId}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      const units = (await backendAPI.get<Unit[]>(`/api/properties/property/${listing.propertyId}/units`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      const data = { listing, property, units };
      return data;
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="space-y-4">
        <Link href="/manage/listings" className="flex flex-row items-center gap-1">
          <FaArrowLeft size={16} />
          <span>Tin đăng</span>
        </Link>
      </div>
      {query.isLoading ? (
        <div className="w-full flex flex-row justify-center items-center">
          <Spinner size={32} />
        </div>
      ) : query.isError ? (
        <div className="w-full flex flex-row justify-center items-center">
          {(query.error as any).response.status === 404 ? (
            <p className="text-slate-600">Tin đăng không tồn tại</p>
          ) : (
            <p className="text-red-600">Đã xảy ra lỗi</p>
          )}
        </div>
      ) : (query.isSuccess && session.status === "authenticated") && (
        <DataProvider>
          <ListingPage session={session.data!} data={query.data} />
        </DataProvider>
      )}
    </div>
  );
};

function ListingPage({
  session,
  data,
}: {
  session: Session,
  data: ManagedListing,
}) {
  const dataCtx = useDataCtx();

  useEffect(() => {
    dataCtx.setSessionData(session);
    dataCtx.setListingData(data);
  }, []);

  return dataCtx.isSet() && (
    <>
      <TopCard />
      <Tabs.Root defaultValue="details" className="TabsRoot">
        <Tabs.List className="TabsList">
          <Tabs.Trigger value="details" className="TabsTrigger">
            Chi tiết
          </Tabs.Trigger>
          <Tabs.Trigger value="policies" className="TabsTrigger">
            Quy định
          </Tabs.Trigger>
          <Tabs.Trigger value="billings" className="TabsTrigger">
            Gói đăng tin
          </Tabs.Trigger>
          <Tabs.Trigger value="views" className="TabsTrigger">
            Lượt xem / tìm kiếm
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="details">
          <div className="space-y-4">
            <ListingDetail/>
            <PropUnits/>
          </div>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="policies">
          <Policies/>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="billings">
          <Billings/>
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="views">
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
}
