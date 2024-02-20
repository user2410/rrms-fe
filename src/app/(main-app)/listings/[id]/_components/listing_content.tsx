import { Separator } from "@/components/ui/separator";
import { Listing } from "@/models/listing";
import { Property } from "@/models/property";
import { format } from "date-fns";
import Gallery from "./gallery";

import { Unit } from "@/models/unit";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ContactForm from "./contact";
import ListingDetails from "./details";
import ListingsForyou from "./for_you";
import GeneralInfo from "./general-info";
import MapNNearby from "./map_nearby";
import PostedBy from "./posted-by";
import RentalPolicies from "./rental_policies";
import Tags from "./tags";
import UnitsList from "./units";
import { GetCityById, GetDistrictById } from "@/utils/dghcvn";
import Breadcrumb from "@/components/ui/breadcrumb";

const TopBreadcrumb = ({
  cityCode,
  districtCode,
}: {
  cityCode: string;
  districtCode: string;
}) => {

  return (
    <Breadcrumb
      items={[
        { label: GetCityById(cityCode)!.name, href: `/city/${cityCode}` },
        { label: GetDistrictById(districtCode)!.name, href: `/city/${cityCode}/district/${districtCode}` }
      ]}
      className="mt-4"
    />
  );
};

export default function ListingContent({
  listing, 
  property, 
  units
} : {
  listing: Listing;
  property: Property;
  units: Unit[];
}) {
  return (
    <div className="space-y-4">
      <Gallery items={property.media} />

      <div className="grid grid-cols-6 gap-6">
        {/* Main content */}
        <div className="space-y-4 col-span-4">
          <div className="space-y-3">
            <TopBreadcrumb cityCode={property.city} districtCode={property.district} />
            <h1 className="font-semibold text-xl">{listing.title}</h1>
            <h3 className="font-normal">{property.fullAddress}</h3>
            <h4 className="font-light text-sm">Đăng vào {format(new Date(2014, 1, 11), 'dd/MM/yyyy hh:mm')}</h4>
          </div>

          <Separator />

          <GeneralInfo listingDetail={{listing, property, units}} />

          <Separator />

          <div>
            <h2 className="font-semibold text-xl mb-2">Thông tin mô tả</h2>
            <div dangerouslySetInnerHTML={{__html: listing.description}}></div>
          </div>

          <Separator />

          <ListingDetails listingDetail={{listing, property, units}} />

          <Separator />

          <UnitsList listingDetail={{listing, property, units}} />

          {listing.policies && listing.policies.length > 0 && (
            <>
              <Separator />
              <RentalPolicies policies={listing.policies} />
            </>
          )}

          <Separator />

          <MapNNearby property={property} />

          <Separator />

          <ListingsForyou listings={[
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
            {
              id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
              title: 'Quản lý quỹ căn độc quyền hot nhà đẹp cho thuê chung cư DCapitale tháng 12 giá 10 triệu/ 01 tháng',
              price: 3000000,
              area: 25,
              city: 'Hồ Chí Minh',
              district: 'Quận 7',
              coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
              postedAt: new Date(2023, 11, 21),
            },
          ]} />
        </div>
        {/* Contact and relavant search */}
        <div className="col-span-2">
          <div className="space-y-4">

            <PostedBy listing={listing} />

            <ContactForm listing={listing} />

            {listing.policies && listing.policies.length > 0 && (
              <Tags tags={property.tags} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
