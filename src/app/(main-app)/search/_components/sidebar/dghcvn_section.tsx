import { SearchFormValues } from "@/app/(main-app)/_components/search_box";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GetCities, GetCityById, GetDistrictById, GetDistricts, GetLocationName, GetWardById, GetWards } from "@/utils/dghcvn";
import Link from "next/link";
import { getSearchURL } from "../get_searchurl";
import { City } from "@/models/dghcvn";

function DistrictsSection({
  city,
}: {
  city: City;
}) {
  const districts = GetDistricts(city.id);

  return (
    <ul className="list-none m-0 p-0">
      {districts.slice(0, 10).map((dist, index) => (
        <li
          key={index}
          className="odd:float-left even:float-right w-1/2 relative flex flex-row items-center border-b border-dashed border-gray-200"
        >
          <Link
            key={index}
            href={getSearchURL({
              pcity: city.id,
              pdistrict: dist.id,
            })}
            className="p-1 inline-flex items-center w-full text-sm hover:underline gap-2"
          >
            Quận {dist.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

function WardsSection({
  districtId,
}: {
  districtId: string;
}) {
  const wards = GetWards(districtId);
  const district = GetDistrictById(districtId);
  const city = GetCityById(district!.cityCode);

  return (
    <ul className="list-none m-0 p-0">
      {wards.slice(0, 10).map((ward, index) => (
        <li
          key={index}
          className="odd:float-left even:float-right w-1/2 relative flex flex-row items-center border-b border-dashed border-gray-200"
        >
          <Link
            key={index}
            href={getSearchURL({
              pcity: city!.id,
              pdistrict: district!.id,
              pward: ward.id,
            })}
            className="p-1 inline-flex items-center w-full text-sm hover:underline gap-2"
          >
            <i className="fa-solid fa-chevron-right text-gray-400 text-xs" />
            {ward.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

function CitiesSection() {
  const cities = GetCities();
  return (
    <ul className="list-none m-0 p-0">
      {cities.slice(0, 10).map((city, index) => (
        <li
          key={index}
          className="odd:float-left even:float-right w-1/2 relative flex flex-row items-center border-b border-dashed border-gray-200"
        >
          <Link
            key={index}
            href={getSearchURL({
              pcity: city.id,
            })}
            className="p-1 inline-flex items-center w-full text-sm hover:underline gap-2"
          >
            <i className="fa-solid fa-chevron-right text-gray-400 text-xs" />
            {city.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function DGHCVNSection({
  query
}: {
  query: SearchFormValues;
}) {
  const ward = query.pward ? GetWardById(query.pward) : undefined;
  const district = query.pdistrict ? GetDistrictById(query.pdistrict) : undefined;
  const city = query.pcity ? GetCityById(query.pcity) : undefined;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Nhà cho thuê {GetLocationName(
            query.pcity || "",
            query.pdistrict || "",
            query.pward || ""
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!!ward ? (
          <WardsSection districtId={ward.districtId}/>
        ) : !!district ? (
          <WardsSection districtId={district.id}/>
        ) : !!city ? (
          <DistrictsSection city={city} />
        ) : (
          <CitiesSection />
        )}
      </CardContent>
      <CardFooter/>
    </Card>
  );
};
