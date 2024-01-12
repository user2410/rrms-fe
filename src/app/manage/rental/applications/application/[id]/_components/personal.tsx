import { ManagedApplication } from "@/models/application";
import PersonalIncome from "./personal_income";
import PersonalRentalHistory from "./personal_rental_history";
import PersonalVehicles from "./personal_vehicles";

export default function Personal({
  data,
}: {
  data: ManagedApplication;
}) {
  return (
    <div className="space-y-4">
      <PersonalRentalHistory data={data}/>
      <PersonalIncome data={data}/>
      <PersonalVehicles data={data}/>
    </div>
  );
};
