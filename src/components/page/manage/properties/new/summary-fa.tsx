import { PropertyForm } from "@/app/manage/properties/new/page";
import { mapPFeatureToText } from "@/models/property";
import { mapUAmenityToText } from "@/models/unit";
import { useFormContext } from "react-hook-form";

export default function SummaryFA() {
  const form = useFormContext<PropertyForm>();
  const property = form.getValues("property");
  const units = form.getValues("units");

  return (
    <div className="space-y-6 px-2">
      <div className="w-full">
        <div className="text-xl my-2">Tiện ích bất động sản</div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Tên
              </th>
              <th scope="col" className="px-6 py-3">
                Mô tả
              </th>
            </tr>
          </thead>
          <tbody>
            {property.features.map((feature, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {mapPFeatureToText[feature.featureId as keyof typeof mapPFeatureToText]}
                </th>
                <td className="px-6 py-4">
                  {feature.description || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(!['COMPLEX', 'BLOCK'].includes(property.type)) && (
        <div className="w-full">
          <div className="text-xl my-2">Tiện nghi căn hộ</div>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Tên
                </th>
                <th scope="col" className="px-6 py-3">
                  Mô tả
                </th>
              </tr>
            </thead>
            <tbody>
              {units[0].amenities?.map((feature, index) => (
                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {mapUAmenityToText[feature.amenityId as keyof typeof mapUAmenityToText]}
                  </th>
                  <td className="px-6 py-4">
                    {feature.description || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}
