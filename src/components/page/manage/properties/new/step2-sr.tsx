"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Step2Amenities from "./step2-amenities";
import Step2NRooms from "./step2-nrooms";

export default function Step2SR() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Phòng</CardTitle>
          <CardDescription>Số phòng trong nhà</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <Step2NRooms />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tiện nghi</CardTitle>
          <CardDescription>Tiện nghi có sẵn trong nhà</CardDescription>
        </CardHeader>
        <CardContent>
          <Step2Amenities nth={0}/>
        </CardContent>
      </Card>
    </div>
  );
}
