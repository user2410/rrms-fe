"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Listing, mockupListings } from "@/models/listing";
import { Property, mockupProperties, pFeatures } from "@/models/property";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import Gallery from "./_components/gallery";

import '@fortawesome/fontawesome-free/css/all.min.css';
import ContactForm from "./_components/contact";
import GeneralInfo from "./_components/general-info";
import PostedBy from "./_components/posted-by";
import RentalPolicies from "./_components/rental_policies";
import ListingDetails from "./_components/details";
import MapNNearby from "./_components/map_nearby";
import ListingsForyou from "./_components/for_you";
import Tags from "./_components/tags";
import { backendAPI } from "@/libs/axios";
import { useCity, useDistrict } from "@/hooks/use-dghcvn";

export type ListingDetail = {
  listing: Listing;
  property: Property;
  // units: Unit[];
};

const TopBreadcrumb = ({
  cityCode,
  districtCode,
}: {
  cityCode: string;
  districtCode: string;
}) => {
  const cityQuery = useCity(cityCode);
  const districtQuery = useDistrict(districtCode);

  if (cityQuery.isLoading || cityQuery.isError
     || districtQuery.isLoading || districtQuery.isError) {
    return null;
  }

  return (
    <Breadcrumb
      items={[
        { label: cityQuery.data!.name, href: `/city/${cityCode}` },
        { label: districtQuery.data!.name, href: `/city/${cityCode}/district/${districtCode}` }
      ]}
      className="mt-4"
    />
  );
};

export default function ListingPage({ params }: { params: { id: string } }) {
  const detailListingQuery = useQuery({
    queryKey: ['listings', 'listing', 'detail-view', params.id],
    queryFn: async ({queryKey}) => {
      const listingQuery = await backendAPI.get(`/api/listings/listing/${queryKey.at(3)}`);
      const listing = listingQuery.data;
      const propertyQuery = await backendAPI.get(`/api/properties/property/${listing.propertyId}`);
      const unitsQuery = await backendAPI.get(`/api/units/property/${listing.propertyId}`);
      return {
        listing,
        property : propertyQuery.data,
        units : unitsQuery.data,
      };
    },
    retry: 1,
    staleTime: 60 * 60 * 1000,
  });
  const data = detailListingQuery.data;

  if (detailListingQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (detailListingQuery.isError) {
    return <div>Error {JSON.stringify(detailListingQuery.error)}</div>;
  }

  return (
    <div className="my-4">
      <div className="container space-y-4">
        <Gallery items={data!.property.media} />

        <div className="grid grid-cols-6 gap-6">
          {/* Main content */}
          <div className="space-y-4 col-span-4">
            <div className="space-y-3">
              <TopBreadcrumb cityCode={data!.property.city} districtCode={data!.property.district}/>
              <h1 className="font-semibold text-xl">{data!.listing.title}</h1>
              <h3 className="font-normal">{data!.property.fullAddress}</h3>
              <h4 className="font-light text-sm">Đăng vào {format(new Date(2014, 1, 11), 'dd/MM/yyyy hh:mm')}</h4>
            </div>

            <Separator />

            <GeneralInfo listingDetail={data!} />

            <Separator />

            <div>
              <h2 className="font-semibold text-xl mb-2">Thông tin mô tả</h2>
              <p>{data!.listing.description}</p>
            </div>

            <Separator />

            <ListingDetails listingDetail={data!} />

            <Separator />

            {data!.listing.policies && data!.listing.policies.length > 0 && (
              <RentalPolicies policies={data!.listing.policies} />
            )}

            <Separator />

            <MapNNearby property={data!.property} />

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
                postAt: new Date(2023, 11, 21),
              },
              {
                id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
                title: 'Nhà cho thuê 2 tầng',
                price: 3000000,
                area: 25,
                city: 'Hồ Chí Minh',
                district: 'Quận 7',
                coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
                postAt: new Date(2023, 11, 21),
              },
              {
                id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
                title: 'Cho thuê căn hộ cao cấp DCapitale Trần Duy Hưng quỹ căn từ studio - 1/2/3pn giá tốt',
                price: 3000000,
                area: 25,
                city: 'Hồ Chí Minh',
                district: 'Quận 7',
                coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
                postAt: new Date(2023, 11, 21),
              },
              {
                id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
                title: 'Tổng hợp tất cả các căn hộ cho thuê tại Smart City Tây Mỗ, LH: 0385 901 *** Thành Đạt',
                price: 3000000,
                area: 25,
                city: 'Hồ Chí Minh',
                district: 'Quận 7',
                coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
                postAt: new Date(2023, 11, 21),
              },
              {
                id: 'f6ca05c0-fad5-46fc-a237-a8e930e7cb01',
                title: 'Quản lý quỹ căn độc quyền hot nhà đẹp cho thuê chung cư DCapitale tháng 12 giá 10 triệu/ 01 tháng',
                price: 3000000,
                area: 25,
                city: 'Hồ Chí Minh',
                district: 'Quận 7',
                coverImg: 'https://file4.batdongsan.com.vn/crop/393x222/2023/11/21/20231121175328-c0af_wm.jpg',
                postAt: new Date(2023, 11, 21),
              },
            ]} />
          </div>
          {/* Contact and relavant search */}
          <div className="col-span-2">
            <div className="space-y-4">

              <PostedBy listing={data!.listing} />

              <ContactForm listing={data!.listing} />

              {data!.listing.policies && data!.listing.policies.length > 0 && (
                <Tags tags={data!.property.tags} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
