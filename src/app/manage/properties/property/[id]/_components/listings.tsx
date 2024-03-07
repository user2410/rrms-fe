import _ from "lodash";
import { usePropDataCtx } from "../_context/property_data.context";
import CurrentListing from "./listings/current_listing";
import OldListings from "./listings/old_listings";

export default function Listings() {
  const {property} = usePropDataCtx();

  return _.isEqual(property, {}) ? (
    <></>
  ) : (
    <div className="space-y-4">
      <CurrentListing property={property}/>
      <OldListings property={property}/>
    </div>
  );
};
