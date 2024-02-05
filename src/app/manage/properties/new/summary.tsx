import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Property, getPropertyFullAddress, getPropertyTypeText, mapPropertyTypeToText } from "@/models/property";
import Image from "next/image";
import { useFormContext } from "react-hook-form";
import SummaryBasicInfo from "./_components/summary-basicinfo";
import SummaryFA from "./_components/summary-fa";
import SummaryMedia from "./_components/summary-media";
import { PropertyForm } from "./page";
import SummaryBlock from "./_components/summary-block";

export default function Summary() {
  const form = useFormContext<PropertyForm>();
  const property = form.getValues("property");

  return (
    <Card className="space-y-6 border-none">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        <div>
          <div className="relative max-w-[320px] aspect-[3/4]">
            <Image
              src={property.media.find((media) => media.type.startsWith("IMAGE"))!.url}
              fill
              objectFit="cover"
              alt="Property cover image"
            />
          </div>
        </div>
        <CardHeader className="col-span-1 md:col-span-3 xl:col-span-4 flex flex-col justify-center">
          <Badge className="inline max-w-fit space-x-1">
            <span className="fa-regular fa-building" />
            <span>{getPropertyTypeText(property as any)}</span>
          </Badge>
          <CardTitle>{property.name}</CardTitle>
          <CardDescription>{getPropertyFullAddress(property as any)}</CardDescription>
        </CardHeader>
      </div>

      <CardContent>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Thông tin cơ bản</AccordionTrigger>
            <AccordionContent>
              <SummaryBasicInfo />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Media</AccordionTrigger>
            <AccordionContent>
              <SummaryMedia />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Tiện ích, tiện nghi</AccordionTrigger>
            <AccordionContent>
              <SummaryFA />
            </AccordionContent>
          </AccordionItem>
          {((["APARTMENT", "ROOM"].includes(property.type) && property.multiUnit) || property.type === "MINIAPARTMENT") && (
            <AccordionItem value="item-4">
              <AccordionTrigger>{getPropertyTypeText(property as any)}</AccordionTrigger>
              <AccordionContent>
                <SummaryBlock />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>

  );
}
