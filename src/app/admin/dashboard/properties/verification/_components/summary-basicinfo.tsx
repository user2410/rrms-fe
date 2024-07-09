import { getPropertyFullAddress, Property } from "@/models/property";
import { GetCityById, GetDistrictById, GetWardById } from "@/utils/dghcvn";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useMemo } from "react";

export default function SummaryBasicInfo({
  property,
} : {
  property: Property;
}) {
  
  const city = useMemo(() => GetCityById(property.city), [property]);
  const district = useMemo(() => GetDistrictById(property.district), [property]);
  const ward = useMemo(() => GetWardById(property.ward || ""), [property]);

  return (
    <div className="space-y-6 px-2">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <tbody>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Diện tích
            </th>
            <td className="px-6 py-4">
              {property.area} m<sup>2</sup>
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Số tầng
            </th>
            <td className="px-6 py-4">
              {property.numberOfFloors ? `${property.numberOfFloors} tầng` : "N/A"} 
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Địa chỉ
            </th>
            <td className="px-6 py-4">
              {getPropertyFullAddress(property)}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Hướng nhà
            </th>
            <td className="px-6 py-4">
              {
                property.orientation === "ne" ? "Đông Bắc" :
                property.orientation === "nw" ? "Tây Bắc" :
                property.orientation === "se" ? "Đông Nam" :
                property.orientation === "sw" ? "Tây Nam" :
                property.orientation === "n" ? "Bắc" :
                property.orientation === "s" ? "Nam" :
                property.orientation === "e" ? "Đông" :
                property.orientation === "w" ? "Tây" :
                "N/A"
              }
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Lỗi vào
            </th>
            <td className="px-6 py-4">
              {property.entranceWidth ? `${property.entranceWidth} m` : "N/A"}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Mặt tiền
            </th>
            <td className="px-6 py-4">
              {property.facade ? `${property.facade} m` : "N/A"}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Năm xây dựng
            </th>
            <td className="px-6 py-4">
              {property.yearBuilt ? property.yearBuilt.toString() : "N/A"}
            </td>
          </tr>
          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              Mô tả
            </th>
            <td className="px-6 py-4">
              {property.description ? <div dangerouslySetInnerHTML={{__html: property.description}} /> : "N/A"}
            </td>
          </tr>
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
