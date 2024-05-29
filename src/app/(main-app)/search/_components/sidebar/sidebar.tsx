"use client";

import { SearchFormValues } from "@/app/(main-app)/_components/search_box";
import AreaSection from "./area_section";
import PriceSection from "./price_section";
import PTypesSection from "./ptypes_section";
import DGHCVNSection from "./dghcvn_section";
import NewListingsSection from "./new_listings_section";

export default function Sidebar({
  query,
} : {
  query: SearchFormValues;
}) {
  return (
    <div className="flex flex-col w-full gap-4">
      {(query.pcity || query.pdistrict || query.pward) && (
        <DGHCVNSection query={query} />
      )}
      <PriceSection />
      <AreaSection />
      <PTypesSection />
      <NewListingsSection />
    </div>
  );
}
