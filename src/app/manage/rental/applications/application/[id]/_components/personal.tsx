import { ManagedApplication } from "@/models/application";
import PersonalIncome from "./personal_income";
import PersonalVehicles from "./personal_vehicles";

export default function Personal({
  data,
}: {
  data: ManagedApplication;
}) {
  return (
    <div className="space-y-4">
      <PersonalIncome data={data}/>
      <PersonalVehicles data={data}/>
    </div>
  );
};
