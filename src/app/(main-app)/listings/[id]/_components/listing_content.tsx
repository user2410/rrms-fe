import { Separator } from "@/components/ui/separator";
import { Listing } from "@/models/listing";
import { getPropertyFullAddress, Property } from "@/models/property";
import { format } from "date-fns";
import Gallery from "./gallery";

import { Unit } from "@/models/unit";
import '@fortawesome/fontawesome-free/css/all.min.css';
import ListingDetails from "./details";
import GeneralInfo from "./general-info";
import MapNNearby from "./map_nearby";
import PostedBy from "./posted-by";
import RecommendedListings from "./recommended_listings";
import RentalPolicies from "./rental_policies";
import UnitsList from "./units";
import NewListingsSection from "@/app/(main-app)/search/_components/sidebar/new_listings_section";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

export default function ListingContent({
  listing,
  property,
  units,
  preview = false,
}: {
  listing: Listing;
  property: Property;
  units: Unit[];
  preview?: boolean;
}) {
  console.log("listing", listing);
  console.log("property", property);
  console.log("units", units);

  return (
    <div className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Main content */}
        <div className="space-y-4 md:col-span-4">
          <Gallery items={property.media} />
          <div className="bg-card border rounded-md space-y-4 px-3 py-4">
            <div className="space-y-3">
              {/* <TopBreadcrumb cityCode={property.city} districtCode={property.district} /> */}
              <h1 className="font-semibold text-xl">{listing.title}</h1>
              {property.verificationStatus === "APPROVED" && (
                <Badge className="bg-green-400">
                  <ShieldCheck className="w-4 h-4 inline" />
                  <span className="ml-1">Đã xác minh</span>
                </Badge>
              )}
              <h3 className="font-normal">{getPropertyFullAddress(property)}</h3>
              <h4 className="font-light text-sm">Đăng lúc {format(new Date(listing.createdAt || new Date()), 'hh:mm dd/MM/yyyy')}</h4>
            </div>
            <Separator />
            <GeneralInfo listingDetail={{ listing, property, units }} preview={preview}/>
            <Separator />
            <div>
              <h2 className="font-semibold text-xl mb-2">Thông tin mô tả</h2>
              <div dangerouslySetInnerHTML={{ __html: listing.description }}></div>
            </div>
            <Separator />
            <ListingDetails listingDetail={{ listing, property, units }} />
            <Separator />
            <UnitsList listingDetail={{ listing, property, units }} preview={preview}/>
            {listing.policies && listing.policies.length > 0 && (
              <>
                <Separator />
                <RentalPolicies policies={listing.policies} />
              </>
            )}
            <Separator />
            <div className="space-y-2">
              <h3 className="font-semibold">Gắn thẻ</h3>
              {listing.tags.length === 0 ? (
                  <p>Bài đăng chưa gắn thẻ</p>
                ) : (
                  <div className="gap-1 lg:flex">
                    {listing.tags.map((field, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal hover:cursor-pointer"
                      >
                        {field.tag}
                      </Badge>
                    ))}
                  </div>
                )}
            </div>
            <Separator />
            <MapNNearby property={property} />
          </div>
        </div>
        {/* Contact and relavant search */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            <PostedBy listing={listing} preview={preview}/>
            {!preview && (
              <>
                <RecommendedListings listingId={listing.id} />
                <NewListingsSection />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
