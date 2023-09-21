import SummaryBasicInfo from "@/components/page/manage/properties/new/summary-basicinfo";
import SummaryBlock from "@/components/page/manage/properties/new/summary-block";
import SummaryFA from "@/components/page/manage/properties/new/summary-fa";
import SummaryMedia from "@/components/page/manage/properties/new/summary-media";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mapPropertyTypeToText } from "@/models/property";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import { PropertyForm } from "./page";

export default function Summary() {
  const form = useFormContext<PropertyForm>();
  const property = form.getValues("property");
  const units = form.getValues("units");

  return (
    <Card className="space-y-6 border-none">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="md:col-span-1">
          <Image
            src={property.media.find((media) => media.type.startsWith("IMAGE"))!.url}
            fill
            className="object-cover !static !h-auto"
            alt="Property cover image"
          />
        </div>
        <CardHeader className="col-span-1 md:col-span-3 xl:col-span-4 flex flex-col justify-center">
          <Badge className="inline max-w-fit space-x-1">
            <span className="fa-regular fa-building"/>
            <span>{mapPropertyTypeToText[property.type as keyof typeof mapPropertyTypeToText]}</span>
          </Badge>
          <CardTitle>{property.name}</CardTitle>
          <CardDescription>{property.fullAddress}</CardDescription>
        </CardHeader>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Thông tin cơ bản</AccordionTrigger>
          <AccordionContent>
            <SummaryBasicInfo/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Media</AccordionTrigger>
          <AccordionContent>
            <SummaryMedia/>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Tiện ích, tiện nghi</AccordionTrigger>
          <AccordionContent>
            <SummaryFA/>
          </AccordionContent>
        </AccordionItem>
        {(property.type === 'BLOCK') && (
          <AccordionItem value="item-4">
            <AccordionTrigger>Đơn vị</AccordionTrigger>
            <AccordionContent>
              <SummaryBlock/>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </Card>

  )
}
