import { pFeatures, Property } from "@/models/property";

export default function SummaryFA({
  property,
} : {
  property: Property;
}) {
  const {units} = property;

  return (
    <div className="space-y-6 px-2">
      <div className="w-full">
        <div className="text-xl my-2">Tiện ích nhà cho thuê</div>
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
                  {pFeatures.find(f => f.id === feature.featureId)!.text}
                </th>
                <td className="px-6 py-4">
                  {feature.description || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
