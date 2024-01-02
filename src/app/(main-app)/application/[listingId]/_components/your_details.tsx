import Employment from "./employment";
import Identity from "./identity";
import RentalHistory from "./rental_history";
import Vehicles from "./vehicles";

export default function YourDetails() {
  // const form = useFormContext<ApplicationForm>();

  return (
    <div className="space-y-4">
      <RentalHistory/>
      <Employment/>
      <Identity/>
      <Vehicles/>
    </div>
  );
}
