import cities from "@assets/dghc/cities.json";
import districts from "@assets/dghc/districts.json";
import wards from "@assets/dghc/wards.json";
import Fuse from "fuse.js";
import type { NextApiRequest, NextApiResponse } from "next";

const searchData = [...cities, ...districts, ...wards];
const fuseInstance = new Fuse(searchData, {
  keys: ["name"],
  threshold: 0.3,
});

function fuzzySearch(input: string, limit : number = 10) {
  var r : {cities: any[], districts: any[], wards: any[]} = {
    cities: [],
    districts: [],
    wards: [],
  };
  const result = fuseInstance.search(input);
  var countC = 0, countD = 0, countW = 0;

  for(const item of result) {
    if ("cityCode" in item.item) {
      if(countD <= limit) { 
        const dist = item.item;
        const city = cities.find((c) => c.id === dist.cityCode);
        r.districts.push({
          ...item.item,
          cityName: city?.name,
        });
        countD++;
      }
    } else if ("districtId" in item.item) {
      if(countW <= limit) { 
        const ward = item.item;
        const dist = districts.find((d) => d.id === parseInt(ward.districtId));
        const city = cities.find((c) => c.id === dist?.cityCode);
        r.wards.push({
          ...item.item,
          cityName: city?.name,
          districtName: dist?.name,
        });
        countW++;
      }
    } else {
      if(countC <= limit) { 
        r.cities.push(item.item as any);
        countC++;
      }
    }
  }

  return r;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { q, limit } = req.query;
  if (!q) {
    return res.status(400).json({ message: "Invalid query" });
  }

  const result = fuzzySearch(q as string, parseInt(limit as string) || 10);

  return res.status(200).json(result);
}
