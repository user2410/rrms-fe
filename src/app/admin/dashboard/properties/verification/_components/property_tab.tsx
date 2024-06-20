import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { backendAPI } from "@/libs/axios";
import { getPrimaryImage, getPropertyFullAddress, getPropertyTypeText, Property, PropertyVerificationRequest } from "@/models/property";
import { Unit } from "@/models/unit";
import { useQuery } from "@tanstack/react-query";
import { Session } from "next-auth";
import Image from "next/image";
import SummaryMedia from "./summary-media";
import SummaryBasicInfo from "./summary-basicinfo";
import SummaryFA from "./summary-fa";
import SummaryBlock from "./summary-block";

export default function PropertyTab({
  propertyId,
  sessionData,
} : {
  propertyId: string;
  sessionData: Session;
}) {
  const query = useQuery<Property>({
    queryKey: ["admin", "properties", "property", propertyId, sessionData.user.accessToken],
    queryFn: async ({queryKey}) => {
      const property = (await backendAPI.get<Property>("/api/properties/property/" + queryKey.at(3), {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data;
      const units = (await backendAPI.get<Unit[]>(`/api/properties/property/${queryKey.at(3)}/units`, {
        headers: {
          Authorization: `Bearer ${queryKey.at(-1)}`,
        }
      })).data || [];
      return {
        ...property,
        units,
      };
    },
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 5,
  });

  return query.isLoading ? (
    <div>Loading...</div>
  ) : query.isError ? (
    <div>Đã có lỗi xảy ra</div>
  ) : (
    <Card className="space-y-6 border-none">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        <div>
          <div className="relative max-w-[320px] aspect-[3/4]">
            <Image
              src={getPrimaryImage(query.data)}
              fill
              objectFit="contain"
              alt="Property cover image"
            />
          </div>
        </div>
        <CardHeader className="col-span-1 md:col-span-3 xl:col-span-4 flex flex-col justify-center">
          <Badge className="inline max-w-fit space-x-1">
            <span className="fa-regular fa-building" />
            <span>{getPropertyTypeText(query.data)}</span>
          </Badge>
          <CardTitle>{query.data.name}</CardTitle>
          <CardDescription>{getPropertyFullAddress(query.data)}</CardDescription>
        </CardHeader>
      </div>
      <ScrollArea className="h-[30vh] p-6 pt-0">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Thông tin cơ bản</AccordionTrigger>
            <AccordionContent>
              <SummaryBasicInfo property={query.data} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Media</AccordionTrigger>
            <AccordionContent>
              <SummaryMedia property={query.data} />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Tiện ích, tiện nghi</AccordionTrigger>
            <AccordionContent>
              <SummaryFA property={query.data} />
            </AccordionContent>
          </AccordionItem>
          {((["APARTMENT", "ROOM"].includes(query.data.type) && query.data.units.length > 0) || query.data.type === "MINIAPARTMENT") && (
            <AccordionItem value="item-4">
              <AccordionTrigger>{getPropertyTypeText(query.data as any)}</AccordionTrigger>
              <AccordionContent>
                <SummaryBlock property={query.data}/>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </ScrollArea>
    </Card>
  );
};
