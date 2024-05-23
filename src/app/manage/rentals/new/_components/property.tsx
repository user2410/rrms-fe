import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormValues } from "../page";
import { useFormContext } from "react-hook-form";
import { useDataCtx } from "../_context/data.context";
import { useQuery } from "@tanstack/react-query";
import { ManagedProperty } from "@/app/manage/properties/page";
import { backendAPI } from "@/libs/axios";
import { getPrimaryImage, mapPropertyTypeToText, Property } from "@/models/property";
import { Unit } from "@/models/unit";
import PropertyTable from "./property-table";
import { propertyTColumns } from "./property-table_columns";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import UnitTable from "./unit_table";
import { unitTColumns } from "./unit-table_columns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

type PropertyData = {
  property: Property;
  units: Unit[];
};

export default function PropertySelection() {
  const form = useFormContext<FormValues>();
  const propertyId = form.watch("propertyId");
  const { sessionData } = useDataCtx();

  const allPropsQuery = useQuery<ManagedProperty[]>({
    queryKey: ["manage", "rentals", "new", "properties", sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const res = (await backendAPI.get("/api/properties/managed-properties", {
        params: {
          fields: "name,full_address,area,orientation,lat,lng,type,media,year_built,primary_image,created_at,updated_at",
        },
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      })).data;
      return res.items as ManagedProperty[];
    },
    enabled: !!sessionData.user,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  const selectedPropQuery = useQuery<PropertyData>({
    queryKey: ['manage', "rentals", "new", 'properties', 'property', propertyId, sessionData.user.accessToken],
    queryFn: async ({ queryKey }) => {
      console.log("enable:", !!propertyId);
      const propertyQuery = await backendAPI.get(`/api/properties/property/${queryKey.at(5)}`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      });
      const unitsQuery = await backendAPI.get(`/api/properties/property/${queryKey.at(5)}/units`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        },
      });
      return {
        property: propertyQuery.data,
        units: unitsQuery.data,
      } as PropertyData;
    },
    cacheTime: 1000 * 60 * 5, // 5 minutes
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: allPropsQuery.isSuccess && !!propertyId,
  });

  useEffect(() => {
    if(!!propertyId) {
      form.setValue("property", allPropsQuery.data?.find(i => i.property.id === propertyId)?.property);
    }
  }, [propertyId]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nhà cho thuê</CardTitle>
        </CardHeader>
        <CardContent>
          {allPropsQuery.isLoading ? (
            <div className="w-full h-full flex justify-center items-center">
              <Spinner size={32} />
            </div>
          ) : allPropsQuery.isError ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">Đã có lỗi xảy ra</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Chọn nhà cho thuê</Label>
              <PropertyTable
                columns={propertyTColumns}
                data={allPropsQuery.data.map(i => i.property)}
              />
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Căn hộ / phòng</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedPropQuery.isError ? (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-red-500">Đã có lỗi xảy ra</p>
            </div>
          ) : selectedPropQuery.isSuccess && (() => {
            const { property, units } = selectedPropQuery.data;
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
                <div className="space-y-2">
                  <Label>Chọn nhà cho thuê</Label>
                  <UnitTable
                    columns={unitTColumns}
                    data={units}
                  />
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>

    </div>
  );
};
