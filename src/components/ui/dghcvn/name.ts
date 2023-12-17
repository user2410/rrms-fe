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
