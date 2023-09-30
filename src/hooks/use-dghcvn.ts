import { City, District, Ward } from "@/models/dghcvn";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCities = () => {
  return useQuery<City[]>({
    queryKey: ["dghcvn", "cities"],
    queryFn: async () => {
      const res = await axios.get("/api/location/dghcvn/cities");
      return res.data;
    },
    staleTime: 24 * 60 * (60 * 1000), // 1 day
    cacheTime: 25 * 60 * (60 * 1000), // 1 day
  });
}

export const useDistricts = (cityCode: string) => {
  return useQuery<District[]>({
    queryKey: ["dghcvn", "districts", cityCode],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get("/api/location/dghcvn/districts", {
        params: { cityCode: queryKey.at(2) }
      });
      return res.data;
    },
    enabled: (!!cityCode),
    staleTime: 24 * 60 * (60 * 1000), // 1 day
    cacheTime: 25 * 60 * (60 * 1000), // 1 day
  });
}

export const useWards = (districtId: string) => {
  return useQuery<Ward[]>({
    queryKey: ["dghcvn", "wards", districtId],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get("/api/location/dghcvn/wards", {
        params: { districtId: queryKey.at(2) }
      });
      return res.data;
    },
    enabled: (!!districtId),
    staleTime: 24 * 60 * (60 * 1000), // 1 day
    cacheTime: 25 * 60 * (60 * 1000), // 1 day
  });
}
