import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import areaRanges from "@configs/area_ranges.json";

export default function AreaSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Xem theo diện tích
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none m-0 p-0">
          {areaRanges.map((item, index) => (
            <li
              key={index}
              className="odd:float-left even:float-right w-1/2 relative flex flex-row items-center border-b border-dashed border-gray-200"
            >
              <Link
                href="/"
                className="p-1 inline-flex items-center w-full text-sm hover:underline gap-2"
              >
                <i className="fa-solid fa-chevron-right text-gray-400 text-xs" />
                {item.title}&nbsp;m<sup>2</sup>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter />
    </Card>
  );
};
