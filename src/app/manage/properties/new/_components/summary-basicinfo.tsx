import { PropertyForm } from "@/app/manage/properties/new/page";
import { GetCityById, GetDistrictById, GetWardById } from "@/utils/dghcvn";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FaCouch, FaToilet } from "react-icons/fa";
import { MdBalcony, MdBathtub, MdBed, MdKitchen } from "react-icons/md";

export default function SummaryBasicInfo() {
  const form = useFormContext<PropertyForm>();
  const property = form.getValues("property");
  const units = form.getValues("units");

  const city = useMemo(() => GetCityById(property.city), [property]);
  const district = useMemo(() => GetDistrictById(property.district), [property]);
  const ward = useMemo(() => GetWardById(property.ward || ""), [property]);

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
                      key === "area" ? "Diện tích" :
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
                    key === "area" ?  (value ? (<span>m<sup>2</sup></span>) : "N/A") :
                    key === "numberOfFloors" ? (value ? `${value} tầng` : "N/A") :
                    key === "fullAddress" ? value.toString() :
                    key === "city" ? (city ? city.name : 'N/A') :
                    key === "district" ? (district ? district.name : 'N/A') :
                    key === "ward" ? (ward ? ward.name : 'N/A') :
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
