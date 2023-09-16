import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mapPFeatureToText, mapPropertyTypeToText } from "@/models/property";
import { mapUAmenityToText } from "@/models/unit";
import { Button } from "@components/ui/button";
import Image from "next/image";
import { Result } from "./page";

export default function Summary({
  result,
  onPrev,
  onSubmit,
}: {
  result: Result;
  onPrev: () => void;
  onSubmit: () => void;
}) {
  return (
    <Card className="space-y-6 border-none">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <Image
            src={result.property.media.find((media) => media.type.startsWith("image"))!.url}
            fill
            className="object-cover !static !h-auto"
            alt="Property cover image"
          />
        </div>
        <CardHeader className="col-span-1 md:col-span-3 xl:col-span-4 flex flex-col justify-center">
          <Badge className="inline max-w-fit space-x-1">
            <span className="fa-regular fa-building"/>
            <span>{mapPropertyTypeToText[result.property.type as keyof typeof mapPropertyTypeToText]}</span>
          </Badge>
          <CardTitle>{result.property.name}</CardTitle>
          <CardDescription>{result.property.fullAddress}</CardDescription>
        </CardHeader>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Thông tin cơ bản</AccordionTrigger>
          <AccordionContent>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <tbody>
                {Object.entries(result.property).map(([key, value], index) => 
                  (!['name', 'type', 'media', 'features', 'tags', 'lat', 'lng', 'placeUrl'].includes(key)) 
                    ? (
                      <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={index}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {key === "area" ? "Diện tích" :
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
                          null}
                        </th>
                        <td className="px-6 py-4">
                          {
                            key === "area" ? `${value} m2` :
                            key === "numberOfFloors" ? `${value} tầng` :
                            key === "fullAddress" ? value.toString() :
                            key === "city" ? value.toString() :
                            key === "district" ? value.toString() :
                            key === "ward" ? value.toString() :
                            key === "yearBuilt" ? value.toString() :
                            key === "description" ? value.toString() :
                            key === "entranceWidth" ? value.toString() :
                            key === "facade" ? `${value} m2` :
                            key === "orientation" ? (
                              value === "ne" ? "Đông Bắc" :
                              value === "nw" ? "Tây Bắc" :
                              value === "se" ? "Đông Nam" :
                              value === "sw" ? "Tây Nam" :
                              value === "n" ? "Bắc" :
                              value === "s" ? "Nam" :
                              value === "e" ? "Đông" :
                              value === "w" ? "Tây" :
                              null
                            ) : null
                          }
                        </td>
                      </tr>
                      ) : null
                  )}
              </tbody>
            </table>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Media</AccordionTrigger>
          <AccordionContent className="space-y-6 px-2">
            <div className="w-full">
              <div className="text-xl my-2">Hình ảnh</div>
              {/* Uploaded images gallery */}
              
            </div>
            <div className="w-full">
              <div className="text-xl my-2">Video</div>
              {/* Youtube video gallery */}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Tiện ích, tiện nghi</AccordionTrigger>
          <AccordionContent className="space-y-6 px-2">
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
                  {result.property.features.map((feature, index) => (
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
                  {result.units.units[0].amenities.map((feature, index) => (
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
          </AccordionContent>
        </AccordionItem>
        {(['BLOCK', 'COMPLEX'].includes(result.property.type)) && (
          <AccordionItem value="item-3">
            <AccordionTrigger>Đơn vị</AccordionTrigger>
            <AccordionContent>
              Liệt kê các units
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      <div className="flex justify-between w-full">
        <Button type="button" variant="outline" onClick={onPrev}>Previous</Button>
        <Button type="button" variant="default" onClick={onSubmit}>Submit</Button>
      </div>
    </Card>

  )
}
