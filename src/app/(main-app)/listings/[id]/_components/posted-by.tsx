import { Card, CardHeader } from "@/components/ui/card";
import { Listing } from "@/models/listing";
import Link from "next/link";


export default function PostedBy({listing} : {listing: Listing}) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <div className="text-sm font-thin">Được đăng bởi</div>
        <h3 className="font-semibold">{listing.fullName}</h3>
        <Link href={'/'}>Xem thêm 20 tin khác</Link>
      </CardHeader>
    </Card>
  );
}
