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
        <TenantTable columns={tenantTColumns} data={[]}/>
      </CardContent>
    </Card>
  );
};
