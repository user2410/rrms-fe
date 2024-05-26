import { getLowerCityName } from "@/utils/dghcvn";
import cities from "@assets/dghc/cities.json";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const result = (await axios.get<Data>("https://geolocation-db.com/json/")).data;
    const lowerCityName = getLowerCityName(result.city);
    const city = Object.entries(cities).find(([key, value]) => getLowerCityName(value.lowerName).includes(lowerCityName));

    return res.status(200).json({
      ...result,
      city: city ? {
        ...city[1],
        code: city[0],
      } : undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
