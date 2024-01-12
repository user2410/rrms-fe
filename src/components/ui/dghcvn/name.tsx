import { useCity, useDistrict, useWard } from "@/hooks/use-dghcvn";

export const GetCityName = (cityId: string) => {
  const cityQuery = useCity(cityId);
  return cityQuery.data?.name;
};

export const GetDistrictName = (distId: string) => {
  const distQuery = useDistrict(distId);
  return distQuery.data?.name;
};

export const GetWardName = (wardId: string) => {
  const wardQuery = useWard(wardId);
  return wardQuery.data?.name;
};

export function GetLocationName({
  cityId, distId, wardId,
} : {
  cityId: string, distId: string, wardId: string
}) {
  const cityQuery = useCity(cityId);
  const distQuery = useDistrict(distId);
  const wardQuery = useWard(wardId);

  const items = [];
  if(cityQuery.isSuccess) items.push(cityQuery.data?.name);
  if(distQuery.isSuccess) items.push(distQuery.data?.name);
  if(wardQuery.isSuccess) items.push(wardQuery.data?.name);

  return (
    <>{items.join(', ')}</>
  );
}
