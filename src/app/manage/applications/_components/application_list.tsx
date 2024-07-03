"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { Fragment } from "react";
import { FetchedApplication } from "../_models/fetched_application";
import ApplicationGroup from "./application_group";

export type PreviewApplication = {
  application: FetchedApplication;
  listing: Listing;
  property: Property;
  unit: Unit;
};

export default function ApplicationList({
  applications,
  listName,
} : {
  applications: FetchedApplication[];
  listName: string,
}) {
  console.log("applications", applications);
  const query = useQuery<PreviewApplication[]>({
    queryKey: ["manage", "rentals", "applications", listName, applications],
    queryFn: async ({ queryKey }) => {
      const applications = queryKey.at(4) as FetchedApplication[];
      const listingIds = applications.map((item: FetchedApplication) => item.listingId);
      const propIds = applications.map((item: FetchedApplication) => item.propertyId);
      const unitIds = _.uniq(applications.map((item: FetchedApplication) => item.unitId).flat());

      const listings = (await backendAPI.get<Listing[]>(`api/listings/ids`, {
        params: {
          listingIds,
          fields: "title,description,price,units",
        }
      })).data;

      const properties = (await backendAPI.get<Property[]>(`api/properties/ids`, {
        params: {
          propIds,
          fields: "name,full_address,city,district,ward,primary_image,media",
        }
      })).data;

      const units = (await backendAPI.get<Unit[]>(`api/units/ids`, {
        params: {
          unitIds,
          fields: "name,floor,number_of_bedrooms,area",
        }
      })).data;

      return applications.map((item: any) => ({
        application: item,
        listing: listings.find((listing) => listing.id === item.listingId)!,
        property: properties.find((property) => property.id === item.propertyId)!,
        unit: units.find((unit) => unit.id === item.unitId)!,
      } as PreviewApplication));
    },
  });

  return (
    <Fragment>
      <div className="my-4 w-full">
        {/* Top search bar */}
        <div className="flex flex-row gap-2 border">
          <Input className="flex-1" placeholder="Tìm theo địa chỉ nhà, người ứng tuyển" />
          <Select>
            <SelectTrigger className="w-[120px] gap-1">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Đang chờ</SelectItem>
                <SelectItem value="name">Đang xét duyệt</SelectItem>
                <SelectItem value="type">Châp nhận</SelectItem>
                <SelectItem value="address">Từ chối</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button type="button" variant="outline">Đặt lại</Button>
        </div>
      </div>
      <div className="flex flex-row justify-between w-full">
        <h2>
          Hiển thị {applications.length} đơn ứng tuyển {(() => {
            const count = applications.filter(a => a.status === "PENDING").length;
            return (count > 0 && "(đơn mới cần xét duyệt)");
          })()} 
        </h2>
        {/* Sort applications */}
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm font-light whitespace-nowrap">Sắp xếp</span>
          <Select defaultValue="newestToOldest">
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="newestToOldest">Mới nhất đến muộn nhất</SelectItem>
                <SelectItem value="oldestToNewest">Muộn nhất đến mới nhất</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      {/* Applications grouped by property */}
      <div className="w-full space-y-4">
        {query.isLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Spinner size={32} />
          </div>
        ) : query.isError ? (
          <div className="w-full h-full flex justify-center items-center">
            <p className="text-red-500">Error: {JSON.stringify(query.error)}</p>
          </div>
        ) : (
          <>
            {Object.entries(_.groupBy(query.data, "property.id")).map(item => (
              <ApplicationGroup key={item[0]} data={item[1]} />
            ))}
            
          </>
        )}
      </div>
    </Fragment>
  );
};
