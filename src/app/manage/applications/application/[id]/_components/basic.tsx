import { ManagedApplication } from "@/models/application";
import BasicCoaps from "./basic_coaps";
import BasicMinors from "./basic_minors";
import BasicPets from "./basic_pets";
import BasicTenant from "./basic_tenant";
import BasicUnits from "./basic_units";
import PersonalVehicles from "./personal_vehicles";

export default function BasicInfo({
  data,
} : {
  data: ManagedApplication;
}) {
  const {application} = data;

  return (
    <div className="space-y-4">
      <BasicTenant data={data}/>
      <BasicUnits data={data}/>
      {/* <BasicIdentity data={data}/> */}
      {application.tenantType === "FAMILY" && (
        <>
          <BasicCoaps data={data}/>
          <BasicMinors data={data}/>
        </>
      )}
      {["INDIVIDUAL", "FAMILY"].includes(application.tenantType) && (
        <>
          <BasicPets data={data}/>
          <PersonalVehicles data={data}/>
        </>
      )}
    </div>
  );
};
