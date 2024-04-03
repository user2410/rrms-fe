import { Card, CardContent, CardHeader } from "@/components/ui/card";
import TenantTable from "./tenant/tenant-table";
import { tenantTColumns } from "./tenant/tenant-table_columns";
import { Button } from "@/components/ui/button";
import { Rental } from "@/models/rental";
import { usePropDataCtx } from "../_context/property_data.context";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import CreateTenantDialog from "./tenant/create-tenant_dialog";

export type RentalExtended = Rental & {
  property: Property;
  unit: Unit;
}

export default function Tenants() {
  const {property, units} = usePropDataCtx();

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-center">
        <>Người thuê nhà</>
        <CreateTenantDialog/>
      </CardHeader>
      <CardContent>
        <TenantTable columns={tenantTColumns} data={[
          {
            id: 1,
            creatorId: "e0a8d123-c55b-4230-91e8-bd1b7b76236a",
            propertyId: "3a7b0433-941c-45a0-b0a2-92402d15eae1",
            property,
            unit: units.find(u => u.id === "04d253b8-da82-4554-adfd-7663bdbe2973")!,
            unitId: "04d253b8-da82-4554-adfd-7663bdbe2973",
            applicationId: "00000000-0000-0000-0000-000000000000",
            tenantId: "tenantId1",
            profileImage: "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg",
            tenantType: "INDIVIDUAL",
            tenantName: "John Doe",
            tenantIdentity: "123456789",
            tenantDob: new Date("1990-01-01"),
            tenantPhone: "1234567890",
            tenantEmail: "john@example.com",
            tenantAddress: "123 Main St, City, Country",
            contractType: "DIGITAL",
            contractContent: "Digital contract content",
            contractLastUpdate: new Date("2023-01-01"),
            contractLastUpdateBy: "Alice",
            landArea: 1000,
            unitArea: 500,
            startDate: new Date("2023-02-01"),
            moveinDate: new Date("2023-02-15"),
            rentalPeriod: 12,
            rentalPrice: 1500,
            note: "Note about the rental",
          },
        ]}/>
      </CardContent>
    </Card>
  );
};
