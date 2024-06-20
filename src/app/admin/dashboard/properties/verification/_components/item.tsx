import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import * as Tabs from '@radix-ui/react-tabs';
import { Session } from 'next-auth';
import { RequestItem } from '../page';
import PropertyTab from './property_tab';
import RequestTab from './request_tab';
import { Button } from "@/components/ui/button";
import { ApproveAction, RejectAction } from "./actions";
import { useRef } from "react";

export default function Item({
  item,
  sessionData,
  refresh,
}: {
  item: RequestItem;
  sessionData: Session;
  refresh: () => void;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog>
      <DialogTrigger>Xem chi tiết</DialogTrigger>
      <DialogContent className="max-w-[60vw]">
        <Tabs.Root defaultValue="property" className="TabsRoot">
          <Tabs.List className="TabsList">
            <Tabs.Trigger className="TabsTrigger" value="property">Nhà cho thuê</Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="request">Minh chứng</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="TabsContent" value="property">
            <PropertyTab propertyId={item.property.id} sessionData={sessionData} />
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="request">
            <RequestTab request={item.request} />
          </Tabs.Content>
        </Tabs.Root>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button ref={closeBtnRef} type="button" variant="ghost">Đóng</Button>
          </DialogClose>
          {item.request.status === "PENDING" && (
            <>
              <RejectAction requestId={item.request.id} property={item.property} sessionData={sessionData} onClose={() => closeBtnRef.current?.click()} />
              <ApproveAction requestId={item.request.id} property={item.property} sessionData={sessionData} onClose={() => closeBtnRef.current?.click()} />
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
