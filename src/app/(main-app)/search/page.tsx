"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import ListingCard from "./_components/listing-card";
import TopSearchBar from "./_components/top-searchbar";
import Sidebar from "./_components/sidebard";
import { mockupSearchingListings } from "@/models/listing";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  console.log(searchParams?.entries);
  
  return (
    <div>
      <TopSearchBar/>
      <div className="container space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Hà Nội"},
            { label: "Thanh Xuân" },
          ]}
          className="mt-4"
        />
        <h1 className="font-semibold text-xl">Nhà cho thuê quận Thanh Xuân</h1>
        <p className="font-normal text-sm">Hiện có 768 bất động sản</p>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8">
            <div className="space-y-4">
              {mockupSearchingListings.map((listing, index) => (
                <Link key={index} href={`/listings/${listing.lid}`}><ListingCard listing={listing}/></Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block md:col-span-4">
            <aside className="sticky top-4">
              <Sidebar cityCode="HN" districtCode="5"/>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
