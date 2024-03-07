import { ManagedApplication } from "@/models/application";
import BasicCoaps from "./basic_coaps";
import BasicMinors from "./basic_minors";
import BasicTenant from "./basic_tenant";
import BasicUnits from "./basic_units";
import BasicPets from "./basic_pets";
import BasicIdentity from "./basic_identity";
import PersonalVehicles from "./personal_vehicles";

export default function BasicInfo({
  data,
} : {
  data: ManagedApplication;
}) {
  return (
    <div className="space-y-4">
      <BasicTenant data={data}/>
      <BasicUnits data={data}/>
      <BasicIdentity data={data}/>
      <BasicCoaps data={data}/>
      <BasicMinors data={data}/>
      <BasicPets data={data}/>
      <PersonalVehicles data={data}/>
    </div>
  );
};
