import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { backendAPI } from "@/libs/axios";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import PropertyTable from "./_components/property-table";
import { propertyTColumns } from "./_components/property-table_columns";
import { unitTColumns } from "./_components/unit-table_columns";
import UnitTable from "./_components/unit_table";
import { ListingFormValues } from "./page";

type PropertyItem = {
  role: string;
  property: Property;
};

export default function Step2() {
  const session = useSession();
  const form = useFormContext<ListingFormValues>();

  const [data, setData] = useState<PropertyItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (session.status !== "authenticated") return;
    (async () => {
      try {
        const managedPropertiesQuery = await backendAPI.get("api/properties/my-properties", {
          params: {
            fields: "name,full_address,area,orientation,lat,lng,type,media,year_built,created_at,updated_at",
          },
          headers: {
            Authorization: `Bearer ${session.data?.user.accessToken}`,
          },
        });
        setData(managedPropertiesQuery.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [session.status]);

  return isLoading ? (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner size={32} />
    </div>
  ) : error ? (
    <div className="w-full h-full flex justify-center items-center">
      <p className="text-red-500">{error.message}</p>
    </div>
  ) : (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Chọn bất động sản</FormLabel>
        <PropertyTable columns={propertyTColumns} data={data!.map(i => i.property)} />
        <FormMessage />
      </FormItem>
      <Step2Units propertyID={form.watch("propertyID")} token={session.data!.user.accessToken} />
    </div>
  );
}

const Step2Units = ({
  propertyID,
  token,
}: {
  propertyID: string;
  token: string;
}) => {
  const [data, setData] = useState<Unit[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>();

  useEffect(() => {
    if(!propertyID) return;
    (async () => {
      try {
        const propertyQuery = await backendAPI.get(`api/properties/property/${propertyID}/units`, {
          params: {
            fields: "name,area,floor,number_of_living_rooms,number_of_bedrooms,number_of_bathrooms,number_of_toilets,number_of_balconies,number_of_kitchens,created_at",
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(propertyQuery.data);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [propertyID, token]);

  return (
    <FormItem>
      <FormLabel>Chọn căn hộ / phòng trọ</FormLabel>
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <Spinner size={32} />
        </div>
      ) : error ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-red-500">{error.message}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <UnitTable columns={unitTColumns} data={data!} />
          <FormMessage />
        </div>
      )}
    </FormItem>
  );

  ;
};
