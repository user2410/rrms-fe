"use client";

import { Button } from "@/components/ui/button";
import { Property } from "@/models/property";
import { Unit } from "@/models/unit";
import * as Tabs from '@radix-ui/react-tabs';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NewManagerRequests from "./_components/new_manager_requests";
import PropertiesGrid from "./_components/properties_grid";

export type ManagedProperty = {
  role: string;
  property: Property & { units: Unit[] };
  listings: string[];
  rentals: string[];
};

export default function ManagePropertiesPage() {
  const router = useRouter();
  const session = useSession();

  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl lg:text-3xl font-light">Nhà cho thuê của bạn</h1>
          <Button type="button" variant="default" onClick={() => router.push('/manage/properties/new')}>Tạo một nhà cho thuê mới</Button>
        </div>
        <Tabs.Root defaultValue="properties" className="TabsRoot">
          <Tabs.List className="TabsList">
            <Tabs.Trigger className="TabsTrigger" value="properties">Quản lý</Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="requests">Yêu cầu quản lý</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="TabsContent" value="properties">
            {session.status === "authenticated" && (
              <PropertiesGrid sessionData={session.data!}/>
            )}
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="requests">
            {session.status === "authenticated" && (
              <NewManagerRequests sessionData={session.data!} />
            )}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
