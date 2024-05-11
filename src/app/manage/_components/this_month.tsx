import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ThisMonth() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            Nợ thuê nhà tháng này
            <Link href="#" className="text-primary text-base font-semibold">Xem tất cả</Link>
          </div>
        </CardTitle>
        <CardDescription>from {12} properties</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">₫45,000,000</span>
        <span className="text-xl font-light">/ ₫120,000,000</span>
      </CardContent>
    </Card>
  );
};
