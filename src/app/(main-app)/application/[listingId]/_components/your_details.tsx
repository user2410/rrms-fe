import { useFormContext } from "react-hook-form";
import { ListingDetail } from "../page";
import Employment from "./employment";
import RentalHistory from "./rental_history";
import Vehicles from "./vehicles";
import { ApplicationForm } from "./main_form";

export default function YourDetails({
  data
} : {
  data: ListingDetail;
}) {
  const form = useFormContext<ApplicationForm>();

  return (
    <div className="space-y-4">
      {form.watch("ao.tenantType") === "INDIVIDUAL" && (
        <>
          <RentalHistory/>
          <Employment/>
          <Vehicles listing={data.listing}/>
        </>
      )}
      {/* <Identity/> */}
    </div>
  );
}
