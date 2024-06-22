import { Property } from "@/models/property";
import { Rental } from "@/models/rental";
import { Unit } from "@/models/unit";
import * as Tabs from '@radix-ui/react-tabs';
import { Session } from "next-auth";
import Link from "next/link";
import GeneralCard from "../../../../rental/[id]/_components/general";
import PaymentinfoCard from "../../../../rental/[id]/_components/payments/paymentinfo_card";
import PoliciesCard from "../../../../rental/[id]/_components/policies";
import TenantCard from "../../../../rental/[id]/_components/tenant_card";
import { ActionModal, RequestReviewModal } from "./action_modals";

export default function PrerentalView({
  preRental,
  property,
  unit,
  key,
  sessionData,
}: {
  preRental: Rental;
  property: Property;
  unit: Unit;
  key?: string;
  sessionData?: Session;
}) {
  return (
    <div className="space-y-4">
      <div className="text-xl font-semibold">
        Profile thuê nhà (chờ duyệt)
      </div>
      <GeneralCard rental={preRental} property={property} unit={unit} />
      {(preRental.tenantId === sessionData?.user.user.id || !!key) && (
        <div className="w-full flex flex-row justify-end gap-2">
          <RequestReviewModal id={preRental.id} key={key} sessionData={sessionData} />
          <ActionModal state="APPROVED" id={preRental.id} key={key} sessionData={sessionData} />
          <ActionModal state="REJECTED" id={preRental.id} key={key} sessionData={sessionData} />
        </div>
      )}
      <Tabs.Root defaultValue="detail" className="TabsRoot">
        <Tabs.List className="TabsList">
          <Tabs.Trigger className="TabsTrigger" value="detail">Khách thuê</Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="services">Dịch vụ</Tabs.Trigger>
          <Tabs.Trigger className="TabsTrigger" value="policies">Quy định</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className="TabsContent" value="detail">
          <TenantCard rental={preRental} />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="services">
          <PaymentinfoCard rental={preRental} />
        </Tabs.Content>
        <Tabs.Content className="TabsContent" value="policies">
          <PoliciesCard rental={preRental} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
