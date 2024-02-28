import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property, getPrimaryImage, mapPropertyTypeToText } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import PropertyTable from "./_components/property-table";
import { propertyTColumns } from "./_components/property-table_columns";
import { unitTColumns } from "./_components/unit-table_columns";
import UnitTable from "./_components/unit_table";
import { ListingFormValues } from "./page";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

type ManagedProperty = {
  role: string;
  property: Property;
};

type PropertyData = {
  property: Property;
  units: Unit[];
};

export default function Step2() {
  const session = useSession();
  const form = useFormContext<ListingFormValues>();
  const propertyId = form.watch("propertyId");

  const allPropsQuery = useQuery<ManagedProperty[]>({
    queryKey: ["manage", "properties"],
    queryFn: async () => {
      return (await backendAPI.get<ManagedProperty[]>("/api/properties/my-properties", {
        params: {
          fields: "name,full_address,area,orientation,lat,lng,type,media,year_built,created_at,updated_at",
        },
        headers: {
          Authorization: `Bearer ${session.data?.user.accessToken}`,
        },
      })).data;
    },
    enabled: session.status === "authenticated",
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return allPropsQuery.isLoading ? (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner size={32} />
    </div>
  ) : allPropsQuery.isError ? (
    <div className="w-full h-full flex justify-center items-center">
      <p className="text-red-500">{JSON.stringify(allPropsQuery.error)}</p>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Chọn nhà cho thuê</Label>
        <PropertyTable columns={propertyTColumns} data={allPropsQuery.data.map(i => i.property)} />
      </div>
      <div className="space-y-2">
        <Label>Nhà cho thuê đã chọn</Label>
        {propertyId ? (
          <SelectedProperty
            accessToken={session.data?.user.accessToken}
            propertyId={propertyId}
          />
        ) : (
          <p className="font-light">Chưa chọn nhà cho thuê</p>
        )}
      </div>
    </div>
  );
}

function SelectedProperty({
  accessToken,
  propertyId,
}: {
  accessToken?: string;
  propertyId: string;
}) {
  const form = useFormContext<ListingFormValues>();
  const selectedPropQuery = useQuery<PropertyData>({
    queryKey: ['manage', 'properties', 'property', propertyId],
    queryFn: async ({ queryKey }) => {
      const propertyQuery = await backendAPI.get(`/api/properties/property/${queryKey.at(3)}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const unitsQuery = await backendAPI.get(`/api/properties/property/${queryKey.at(3)}/units`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return {
        property: propertyQuery.data,
        units: unitsQuery.data,
      } as PropertyData;
    },
    cacheTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!accessToken && !!propertyId,
  });

  if (selectedPropQuery.isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (selectedPropQuery.isError) {
    return (
      <div>{JSON.stringify(selectedPropQuery.error)}</div>
    );
  }

  const { property, units } = selectedPropQuery.data;
  console.log("Selected property: ", property, units);
  const multiUnits = (units.length > 1);
  form.setValue("propertyData", selectedPropQuery.data);
  if(!multiUnits){
    form.setValue('units', [{unitId: units[0].id, price: 0}]);
  }
  return (
    <div className="space-y-2">
      <div className="w-full flex flex-row gap-4">
        <div className="relative w-48 aspect-video">
          <Image
            src={getPrimaryImage(property)}
            alt=""
            fill
            objectFit="contain"
          />
        </div>
        <div>
          <Badge>
            {units.length > 1 
            ? (property.type === 'APARTMENT' ? `Quỹ căn hộ` : property.type === 'ROOM' ? 'Dãy phòng trọ' : '') 
            : mapPropertyTypeToText[property.type as keyof typeof mapPropertyTypeToText]}
          </Badge>
          <h2 className="text-2xl font-medium capitalize">{property.name}</h2>
          <h3 className="text-sm font-normal">{property.fullAddress}</h3>
        </div>
      </div>
      {multiUnits && (
        <Step2Units units={units} />
      )}
    </div>
  );
}

const Step2Units = ({
  units,
}: {
  units: Unit[];
}) => {
  return (
    <FormItem>
      <FormLabel>Chọn căn hộ / phòng trọ</FormLabel>
      <div className="space-y-4">
        <UnitTable columns={unitTColumns} data={units} />
        <FormMessage />
      </div>
    </FormItem>
  );

  ;
};
