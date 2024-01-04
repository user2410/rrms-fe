import { Property } from "@/models/property";
import { Fragment } from "react";
import PropertyCard from "./property_card";
import { ManagedProperty } from "../page";

export default function PropertiesGrid({ 
  initialProperties 
} : { 
  initialProperties: ManagedProperty[];
}) {
  return (
    <Fragment>
      {/* <TopSearchbar /> */}
      <h2>Showing {initialProperties.length} properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {initialProperties.map((p, i) => (
          <PropertyCard key={i} property={p.property}></PropertyCard>
        ))}
      </div>
    </Fragment>

  );
};
