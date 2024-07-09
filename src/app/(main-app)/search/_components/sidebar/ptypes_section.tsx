import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { mapPropertyTypeToText } from "@/models/property";
import { getSearchURL } from "../get_searchurl";

export default function PTypesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          Danh mục cho thuê
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-none m-0 p-0">
          {[
            {
              ptype: "APARTMENT",
              count: 190,
            },
            {
              ptype: "ROOM",
              count: 100,
            },
            {
              ptype: "PRIVATE",
              count: 50,
            },
            {
              ptype: "STORE",
              count: 25,
            },
            {
              ptype: "OFFICE",
              count: 15,
            },
            {
              ptype: "VILLA",
              count: 5,
            },
            {
              ptype: "MINIAPARTMENT",
              count: 2,
            },
          ].map((item, index) => (
            <li 
              key={index}
              className="border-b border-dashed border-gray-200"
            >
              <Link 
                href={getSearchURL({ptypes: [item.ptype]})}
                className="p-1 flex flex-row items-center justify-between w-full text-sm hover:underline gap-2"
              >
                <span className="space-x-2">
                  <i className="fa-solid fa-chevron-right text-gray-400 text-xs"/>
                  <span>
                    Cho thuê&nbsp;{mapPropertyTypeToText[item.ptype as keyof typeof mapPropertyTypeToText].toLowerCase()}
                  </span>
                </span>
                <span>({item.count})</span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter/>
    </Card>
  );
};
