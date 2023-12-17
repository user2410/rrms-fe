import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function BillTile() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            Bill collected
            <Link href="#" className="text-primary text-base font-semibold">View all</Link>
          </div>
        </CardTitle>
        <CardDescription>from {8} properties this month</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">₫45,000,000</span>
        <span className="text-xl font-light">/ ₫120,000,000</span>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full">
          <span className="text-primary text-md font-bold mr-2">45%</span>
          <div className="bg-gray-200 flex-1 h-2.5">
            <div className="bg-primary w-2.5 h-2.5" style={{ width: '45%' }}></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
