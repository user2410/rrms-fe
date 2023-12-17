import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function RentArrearTile() {
  const statArrow = "up";
  const statChange = "3.48";
  const statSince = "Since last month";

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            Rental arrears
            <Link href="#" className="text-primary text-base font-semibold">View all</Link>
          </div>
        </CardTitle>
        <CardDescription>from {12} properties</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">₫45,000,000</span>
        <span className="text-xl font-light">/ ₫120,000,000</span>
      </CardContent>
      <CardFooter>
        <div className="flex items-end space-x-2">
          {statArrow === "up" ? (
            <div className="inline-block space-x-1 text-emerald-500">
              <i className="fas fa-arrow-up"/>
              <span>{statChange}</span>
            </div>
          ) : statArrow === "down" ? (
            <div className="inline-block space-x-1 text-red-500">
              <i className="fas fa-arrow-down"/>
              <span>{statChange}</span>
            </div>
          ) : (
            <div className="inline-block space-x-1 text-gray-500">
              <i className="fas fa-equals"/>
              <span>{statChange}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground">{statSince}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
