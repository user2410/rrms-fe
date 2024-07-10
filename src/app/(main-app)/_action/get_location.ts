import { GeolocationDB } from "@/models/dghcvn";
import { getLowerCityName } from "@/utils/dghcvn";
import cities from "@assets/dghc/cities.json";
import axios from "axios";

type Data = {
  country_code: string;
  country_name: string;
  city: string;
  postal: string;
  latitude: number;
  longitude: number;
  IPv4: string;
  state: string;
};

export async function getCurrentLocation(): Promise<GeolocationDB> {
  const result = (await axios.get<Data>("https://geolocation-db.com/json/"))
    .data;
  const lowerCityName = getLowerCityName(result.city);
  const city = Object.entries(cities).find(([key, value]) =>
    getLowerCityName(value.lowerName).includes(lowerCityName),
  );

  if (!city) {
    throw new Error("Thành phố không tồn tại trong danh sách!");
  }

  return {
    ...result,
    city: city
      ? {
          ...city[1],
          code: city[0],
        }
      : undefined,
  };
}
