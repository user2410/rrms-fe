"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCity, useDistrict, useDistricts, useWards } from "@/hooks/use-dghcvn";
import Link from "next/link";

const DistrictDropdownContent = ({
  cityCode,
}: {
  cityCode: string;
}) => {
  const cityQuery = useCity(cityCode);
  const districtQuery = useDistricts(cityCode);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nhà đất cho thuê tại {cityQuery.data?.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        <Accordion type="multiple">
          {districtQuery.data?.map((dist, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{dist.name}</AccordionTrigger>
              <AccordionContent>
                <Link key={index} href={`/search?ward=${dist.id}`} className="hover:underline">{dist.name}</Link>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

const WardDropdownContent = ({
  districtCode,
}: {
  districtCode: string;
}) => {
  const districtQuery = useDistrict(districtCode);
  const wardQuery = useWards(districtCode);

  if (districtQuery.isError) {
    console.log(districtQuery.error);
    return null;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nhà đất cho thuê tại quận {districtQuery.data?.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-2">
        {wardQuery.data?.map((ward, index) => (
          <Link key={index} href={`/search?ward=${ward.id}`} className="hover:underline">{ward.name}</Link>
        ))}
      </CardContent>
    </Card>
  );
};

const PriceSection = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Lọc theo khoảng giá</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-none space-y-2">
        <li>Thoả thuận</li>
        <li><Link href="/" className="hover:underline">Dưới 1 triệu</Link></li>
        <li><Link href="/" className="hover:underline">1-3 triệu</Link></li>
        <li><Link href="/" className="hover:underline">3-5 triệu</Link></li>
        <li><Link href="/" className="hover:underline">5-10 triệu</Link></li>
        <li><Link href="/" className="hover:underline">10-40 triệu</Link></li>
        <li><Link href="/" className="hover:underline">40-70 triệu</Link></li>
        <li><Link href="/" className="hover:underline">70-100 triệu</Link></li>
        <li><Link href="/" className="hover:underline">Trên 100 triệu</Link></li>
      </ul>
    </CardContent>
  </Card>
);

const AreaSection = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Lọc theo diện tích</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="list-none space-y-2">
        <li><Link href="/" className="hover:underline">Dưới 30m<sup>2</sup></Link></li>
        <li><Link href="/" className="hover:underline">30-50 m<sup>2</sup></Link></li>
        <li><Link href="/" className="hover:underline">50-80 m<sup>2</sup></Link></li>
        <li><Link href="/" className="hover:underline">80-100 m<sup>2</sup></Link></li>
        <li><Link href="/" className="hover:underline">100-150 m<sup>2</sup></Link></li>
        <li><Link href="/" className="hover:underline">150-200 m<sup>2</sup></Link></li>
        <li><Link href="/" className="hover:underline">200-250 m<sup>2</sup></Link></li>
        <li><Link href="/" className="hover:underline">Trên 100 triệu</Link></li>
      </ul>
    </CardContent>
  </Card>
);

export default function Sidebar({
  cityCode,
  districtCode,
}: {
  cityCode: string;
  districtCode?: string;
}) {
  return (
    <div className="flex flex-col w-full gap-4">
      {districtCode ? (
        <WardDropdownContent districtCode={districtCode} />
      ) : (
        <DistrictDropdownContent cityCode={cityCode} />
      )}
      <PriceSection />
      <AreaSection />
    </div>
  );
}
