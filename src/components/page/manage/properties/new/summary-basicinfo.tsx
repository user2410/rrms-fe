import { PropertyForm } from "@/app/manage/properties/new/page";
import { City, District, Ward } from "@/models/dghcvn";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useFormContext } from "react-hook-form";
import { FaToilet } from "react-icons/fa";
import { MdBalcony, MdBathtub, MdBed } from "react-icons/md";

export default function SummaryBasicInfo() {
  const form = useFormContext<PropertyForm>();
  const property = form.getValues("property");
  const units = form.getValues("units");

  const cityQuery = useQuery<City[]>({
    queryKey: ["dghcvn", "cities"],
    queryFn: async () => {
      const res = await axios.get("/api/location/dghcvn/cities");
      return res.data;
    },
    staleTime: 24 * 60 * (60 * 1000), // 1 day
    cacheTime: 25 * 60 * (60 * 1000), // 1 day
  });

  const districtQuery = useQuery<District[]>({
    queryKey: ["dghcvn", "districts", property.city],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get("/api/location/dghcvn/districts", {
        params: { cityCode: queryKey.at(2) }
      });
      return res.data;
    },
    enabled: (!!property.city),
    staleTime: 24 * 60 * (60 * 1000), // 1 day
    cacheTime: 25 * 60 * (60 * 1000), // 1 day
  });

  const wardQuery = useQuery<Ward[]>({
    queryKey: ["dghcvn", "wards", property.district],
    queryFn: async ({ queryKey }) => {
      const res = await axios.get("/api/location/dghcvn/wards", {
        params: { districtId: queryKey.at(2) }
      });
      return res.data;
    },
    enabled: (!!property.district),
    staleTime: 24 * 60 * (60 * 1000), // 1 day
    cacheTime: 25 * 60 * (60 * 1000), // 1 day
  });

  return (
    <div className="space-y-6 px-2">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <tbody>
          {Object.entries(property).map(([key, value], index) =>
            (!['name', 'type', 'media', 'features', 'tags', 'lat', 'lng', 'placeUrl'].includes(key))
              ? (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {
                      key === "numberOfFloors" ? "Số tầng" :
                      key === "fullAddress" ? "Địa chỉ" :
                      key === "city" ? "Tỉnh / Thành phố" :
                      key === "district" ? "Quận / huyện" :
                      key === "ward" ? "Phường / xã" :
                      key === "orientation" ? "Hướng nhà" :
                      key === "yearBuilt" ? "Năm xây dựng" :
                      key === "description" ? "Mô tả" :
                      key === "entranceWidth" ? "Lỗi vào" :
                      key === "facade" ? "Mặt tiền" :
                      null
                    }
                  </th>
                  <td className="px-6 py-4">
                    {
                    key === "area" ? (<span>{value.toString()}m<sup>2</sup></span>) :
                    key === "numberOfFloors" ? `${value} tầng` :
                    key === "fullAddress" ? value.toString() :
                    key === "city" ? (
                      (cityQuery.isLoading || cityQuery.isError) ? 'N/A' :
                      (cityQuery.data.find(item => item.id == value)?.name)
                    ) :
                    key === "district" ? (
                      (districtQuery.isLoading || districtQuery.isError) ? 'N/A' :
                      (districtQuery.data.find(item => item.id == value)?.name)
                    ) :
                    key === "ward" ? (
                      (wardQuery.isLoading || wardQuery.isError) ? 'N/A' :
                      (wardQuery.data.find(item => item.id == value)?.name)
                    ) :
                      key === "yearBuilt" ? (!value ? 'N/A' : value.toString()) :
                      key === "description" ? (!value ? 'N/A' : value.toString()) :
                      key === "entranceWidth" ? (!value ? 'N/A' : value.toString()) :
                      key === "facade" ? (!value ? 'N/A' : (<span>{value.toString()}m<sup>2</sup></span>)) :
                      key === "orientation" ? (!value ? 'N/A' : (
                        value === "ne" ? "Đông Bắc" :
                        value === "nw" ? "Tây Bắc" :
                        value === "se" ? "Đông Nam" :
                        value === "sw" ? "Tây Nam" :
                        value === "n" ? "Bắc" :
                        value === "s" ? "Nam" :
                        value === "e" ? "Đông" :
                        value === "w" ? "Tây" :
                      null
                    )) : null
                    }
                  </td>
                </tr>
              ) : null
          )}
        </tbody>
      </table>
      <div className="w-full">
        {(!['BLOCK', 'COMPLEX'].includes(property.type)) && (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2">
            {units[0].numberOfBedrooms && (
              <div className="border-y grid grid-cols-2">
                <div className="flex items-center gap-1">
                  <MdBed size={24} />
                  <span>Phòng ngủ</span>
                </div>
                <div className="py-4">{units[0].numberOfBedrooms}</div>
              </div>
            )}
            {units[0].numberOfBathrooms && (
              <div className="border-y grid grid-cols-2">
                <div className="flex items-center gap-1">
                  <MdBathtub size={24} />
                  <span>Phòng tắm</span>
                </div>
                <div className="py-4">{units[0].numberOfBathrooms}</div>
              </div>
            )}
            {units[0].numberOfToilets && (
              <div className="border-y grid grid-cols-2">
                <div className="flex items-center gap-1">
                  <FaToilet size={24} />
                  <span>Toilet</span>
                </div>
                <div className="py-4">{units[0].numberOfToilets}</div>
              </div>
            )}
            {units[0].numberOfLivingRooms && (
              <div className="border-y grid grid-cols-2">
                <div className="flex items-center gap-1">
                  <FaToilet size={24} />
                  <span>Phòng khách</span>
                </div>
                <div className="py-4">{units[0].numberOfLivingRooms}</div>
              </div>
            )}
            {units[0].numberOfKitchens && (
              <div className="border-y grid grid-cols-2">
                <div className="flex items-center gap-1">
                  <FaToilet size={24} />
                  <span>Phòng bếp</span>
                </div>
                <div className="py-4">{units[0].numberOfKitchens}</div>
              </div>
            )}
            {units[0].hasBalcony ? (
              <div className="border-y">
                <div className="flex items-center gap-1">
                  <FaToilet size={24} />
                  <span>Có ban công</span>
                </div>
              </div>
            ) : units[0].numberOfBalconies ? (
              <div className="border-y grid grid-cols-2">
                <div className="flex items-center gap-1">
                  <MdBalcony size={24} />
                  <span>Ban công</span>
                </div>
                <div className="py-4">{units[0].numberOfBalconies}</div>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className="w-full">
        <div className="text-lg my-2">Vị trí trên bản đồ</div>
        <GoogleMap
          mapContainerStyle={{ height: "400px" }}
          center={{ lat: property.lat, lng: property.lng }}
          zoom={15}
        >
          <MarkerF
            position={{ lat: property.lat, lng: property.lng }}
          />
        </GoogleMap>
      </div>
    </div>
  );
}
