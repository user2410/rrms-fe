import { Button } from "@/components/ui/button";
import { CardContent, CardHeader } from "@/components/ui/card";
import { ToMillion } from "@/utils/currency";
import Image from "next/image";
import Link from "next/link";

type ReducedListing = {
  id: string;
  coverImg: string;
  title: string;
  price: number;
  area: number;
  city: string;
  district: string;
  postedAt: Date;
}

function ListingCard({ listing }: { listing: ReducedListing }) {
  return (
    <Link href={`listings/${listing.id}`}>
      <CardContent className="rounded-sm w-full p-0">
        <CardHeader className="block relative w-full p-0 aspect-video">
          <Image
            src={listing.coverImg}
            alt={listing.title}
            fill
            className="object-cover" />
        </CardHeader>
        <CardContent className="p-3">
          <h3 className="truncate">{listing.title}</h3>
          <h4 className="text-red-600">{ToMillion(listing.price)}/tháng - {listing.area}m<sup>2</sup></h4>
          <h5 className="text-gray-500 space-x-2">
            <i className="fas fa-location-dot" />
            <span>{listing.city}, {listing.district}</span>
          </h5>
        </CardContent>
      </CardContent>
    </Link>
  );
}

export default function RentalInplace() {
  return (
    <div className="w-full h-full py-6 flex flex-col items-center gap-6">
      <h2 className="text-4xl">Nhà cho thuê ở Hồ Chí Minh</h2>
      <div className="grid grid-cols-4 gap-2">
        {[
          {
            id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
            title: 'Phòng trọ giá rẻ',
            price: 3000000,
            area: 25,
            city: 'Hồ Chí Minh',
            district: 'Quận 7',
            coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
            postedAt: new Date(2023, 11, 21),
          },
          {
            id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
            title: 'Nhà cho thuê 2 tầng',
            price: 3000000,
            area: 25,
            city: 'Hồ Chí Minh',
            district: 'Quận 7',
            coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
            postedAt: new Date(2023, 11, 21),
          },
          {
            id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
            title: 'Cho thuê căn hộ cao cấp DCapitale Trần Duy Hưng quỹ căn từ studio - 1/2/3pn giá tốt',
            price: 3000000,
            area: 25,
            city: 'Hồ Chí Minh',
            district: 'Quận 7',
            coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
            postedAt: new Date(2023, 11, 21),
          },
          {
            id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
            title: 'Tổng hợp tất cả các căn hộ cho thuê tại Smart City Tây Mỗ, LH: 0385 901 *** Thành Đạt',
            price: 3000000,
            area: 25,
            city: 'Hồ Chí Minh',
            district: 'Quận 7',
            coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
            postedAt: new Date(2023, 11, 21),
          },
        ].map((listing, index) => (
          <ListingCard key={index} listing={listing} />
        ))}
      </div>
      <Button>Xem thêm</Button>
    </div>
  );
};
