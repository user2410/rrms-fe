import { PropertyForm } from "@/app/manage/properties/new/page";
import { uAmenities } from "@/models/unit";
import { useFormContext } from "react-hook-form";
import LightGallery from 'lightgallery/react';

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';

export default function SummaryBlock() {
  const form = useFormContext<PropertyForm>();
  const units = form.getValues("units");

  return (
    <div className="px-2">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              {form.getValues("property.type") === "ROOM" ? "Phòng" : "Căn hộ"}
            </th>
            <th scope="col" className="px-6 py-3">
              Diện tích (m<sup>2</sup>)
            </th>
            <th scope="col" className="px-6 py-3">
              Tầng
            </th>
            <th scope="col" className="px-6 py-3">
              Tiện nghi
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              Ảnh
            </th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {unit.name}
              </th>
              <td className="px-6 py-4">
                {unit.area}
              </td>
              <td className="px-6 py-4">
                {unit.floor || "N/A"}
              </td>
              <td className="px-6 py-4">
                {unit.amenities ? (
                  <ul className={unit.amenities.length > 1 ? "list-disc" : ""}>
                    {unit.amenities.map((amenity, index) => (
                      <li key={index}>
                        <span className="font-medium">
                          {uAmenities.find(a => a.id.toString() === amenity.amenityId)!.text}
                        </span>
                        {amenity.description ? (<span>{`: ${amenity.description}`}</span>) : null}
                      </li>
                    ))}
                  </ul>
                ) : "N/A"}
              </td>
              <td className="max-w-[540px]">
                <LightGallery plugins={[lgZoom, lgThumbnail]} mode="lg-fade" elementClassNames="flex flex-row justify-center flex-wrap gap-2">
                  {unit.media.map((media, index) => (
                    <a
                      key={index}
                      className="gallery-item"
                      data-src={media.url}
                      data-sub-html={media.description && `<h4>${media.description}</h4>`}
                    >
                      <img
                        src={media.url}
                        alt={media.description}
                        className="m-2 max-w-[100px] aspect-video object-contain"
                      />
                    </a>
                  ))}
                </LightGallery>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
