import { City, District, Ward } from "@/models/dghcvn";
import cities from "@assets/dghc/cities.json";
import districts from "@assets/dghc/districts.json";
import wards from "@assets/dghc/wards.json";

import Fuse from "fuse.js";

const citiesArr = (() => {
  const res = [];
  for (const [key, value] of Object.entries(cities)) {
    res.push({ ...value, id: key });
  }
  return res;
})();

const districtsArr = (() => {
  const res = [];
  for (const [key, value] of Object.entries(districts)) {
    res.push({ ...value, id: key });
  }
  return res;
})();

const wardsArr = (() => {
  const res = [];
  for (const [key, value] of Object.entries(wards)) {
    res.push({ ...value, id: key });
  }
  return res;
})();

export function GetCities(): City[] {
  return citiesArr;
}

export function GetCityById(cityCode: string): City | null {
  const value = cities[cityCode as keyof typeof cities];

  return value
    ? {
        id: cityCode,
        ...value,
      }
    : null;
}

export function GetDistricts(cityCode: string): District[] {
  return districtsArr.filter((d) => d.cityCode == cityCode);
}

export function GetDistrictById(districtId: string): District | null {
  const value = districts[districtId as keyof typeof districts];
  return value
    ? {
        id: districtId,
        ...value,
      }
    : null;
}

export function GetWards(districtId: string): Ward[] {
  return wardsArr.filter((w) => w.districtId == districtId);
}

export function GetWardById(wardId: string): Ward | null {
  const value = wards[wardId as keyof typeof wards];
  return value
    ? {
        id: wardId,
        ...value,
      }
    : null;
}

export function GetLocationName(
  cityId: string,
  distId: string,
  wardId: string,
): string {
  const items = [];
  const city = GetCityById(cityId);
  const dist = GetDistrictById(distId);
  const ward = GetWardById(wardId);
  if (ward) {
    items.push(ward.name);
  }
  if (dist) {
    items.push(dist.name);
  }
  if (city) {
    items.push(city.name);
  }
  return items.join(", ");
}

const searchData = [...citiesArr, ...districtsArr, ...wardsArr];
const fuseInstance = new Fuse(searchData, {
  keys: ["name"],
  threshold: 0.3,
});

export function FuzzySearch(input: string, limit: number = 10) {
  var r: { cities: any[]; districts: any[]; wards: any[] } = {
    cities: [],
    districts: [],
    wards: [],
  };
  const result = fuseInstance.search(input);
  var countC = 0,
    countD = 0,
    countW = 0;

  for (const item of result) {
    if ("cityCode" in item.item) {
      if (countD <= limit) {
        const dist = item.item;
        const city = GetCityById(dist.cityCode as string);
        r.districts.push({
          ...item.item,
          cityName: city!.name,
        });
        countD++;
      }
    } else if ("districtId" in item.item) {
      if (countW <= limit) {
        const ward = item.item;
        const dist = GetDistrictById(ward.districtId as string);
        const city = GetCityById(dist!.cityCode);
        r.wards.push({
          ...item.item,
          cityId: city!.id,
          cityName: city!.name,
          districtName: dist!.name,
        });
        countW++;
      }
    } else {
      if (countC <= limit) {
        r.cities.push(item.item as any);
        countC++;
      }
    }
  }

  return r;
}

const northernProvinces: string[] = ["HN", "HP", "BD", "HT", "TB", "NB", "QT", "VL", "LS", "CB", "BK", "TQ", "LCH", "YB", "SL", "QB"];
const centralProvinces: string[] = ["DDN", "LA", "QNA", "BTH", "QNI", "TH", "NA", "HD", "BP", "HNA", "PY", "NT", "DDT", "KT", "QT", "TN", "PY", "DDT", "QT"];
const southernProvinces: string[] = ["SG", "DNA", "CT", "BDD", "TG", "AG", "CM", "ST", "TV", "TNI", "DNO", "BL", "TV", "DDT", "HG", "HGI", "CM", "ST", "BTR"];

export function getRegion(provinceId: string): string | null {
  if (northernProvinces.includes(provinceId)) {
      return "north";
  } else if (centralProvinces.includes(provinceId)) {
      return "middle";
  } else if (southernProvinces.includes(provinceId)) {
      return "south";
  } else {
      return null;
  }
}
