"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Tabs from '@radix-ui/react-tabs';
import clsx from "clsx";
import { Fragment } from "react";
import { ManagedApplication } from "../page";
import ApplicationItem from "./application_item";
import styles from "./application_list.module.css";
import TopSearchbar from "./top_searchbar";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatDistance, intervalToDuration } from "date-fns";

export default function ApplicationList({
  initialApplications,
}: {
  initialApplications: ManagedApplication[];
}) {
  // group applications by property id
  const groups = initialApplications.reduce((acc, a) => {
    const propertyId = a.property.id;
    if (!acc[propertyId]) {
      acc[propertyId] = {
        property: a.property,
        applications: [],
      };
    }
    acc[propertyId].applications.push(a);
    return acc;
  }, {} as Record<string, { property: ManagedApplication["property"]; applications: ManagedApplication[] }>);
  // number of new applications in PENDING state
  const nNewApplications = initialApplications.filter(a => a.application.status === "PENDING").length;

  return (
    <Fragment>
      <Tabs.Root defaultValue="active" className={styles.TabsRoot}>
        <Tabs.List className={styles.TabsList}>
          <Tabs.Trigger value="active" className={clsx(styles.TabsTrigger, "!focus:ring-0")}>Active</Tabs.Trigger>
          <Tabs.Trigger value="archived" className={clsx(styles.TabsTrigger, "!focus:ring-0")}>Lưu trữ</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={styles.TabsContent} value="active">
          <div className="my-4 w-full">
            <TopSearchbar />
          </div>
          <div className="flex flex-row justify-between w-full">
            <h2>Hiển thị {initialApplications.length} đơn ứng tuyển ({nNewApplications} đơn mới cần xét duyệt)</h2>
            <div className="flex flex-row items-center gap-2">
              <span className="text-sm font-light whitespace-nowrap">Sắp xếp</span>
              <Select defaultValue="newestToOldest">
                <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="newestToOldest">Mới nhất đến muộn nhất</SelectItem>
                    <SelectItem value="oldestToNewest">Muộn nhất đến mới nhất</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="w-full space-y-4">
            {/* Group application by property */}
            {groups && Object.values(groups).map((g, i) => (
              <div key={i} className="border">
                {/* Brief property info */}
                <div className="flex flex-row items-center justify-between gap-2 border p-2">
                  <div className="flex flex-row items-center gap-2">
                    <div className="relative w-[120px] aspect-video">
                      <Image
                        src={g.property.media[0].url}
                        fill
                        alt={g.property.fullAddress}
                        objectFit="cover"
                        objectPosition="center"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-lg font-medium">{g.property.name}</h3>
                      <p className="text-sm font-light">{g.property.fullAddress}</p>
                    </div>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button variant="link">Mời ứng tuyển</Button>
                    <Separator orientation="vertical" />
                    <div className="flex flex-row items-center gap-1">
                      <Label htmlFor="turnon_notification">Nhận đơn ứng tuyển</Label>
                      <Switch defaultChecked id="turnon_notification" />
                    </div>
                  </div>
                </div>
                {/* New applications within 20 days */}
                {g.applications.filter(a => {
                  const diff = intervalToDuration({
                    start: a.application.createdAt,
                    end: new Date()
                  });
                  return diff.days ? diff.days < 20 : false;
                }).map((a, i) => (
                  <ApplicationItem ma={a} key={i} />
                ))}
                {/* Applications older than 20 days */}
                {(() => {
                  const nApplications = g.applications.filter(a => {
                    const diff = intervalToDuration({
                      start: a.application.createdAt,
                      end: new Date()
                    });
                    return diff.days ? diff.days > 20 : false;
                  });
                  if (!nApplications.length) return null;
                  return (
                    <div className="flex flex-row items-center justify-between gap-2 border p-2">
                      <div className="flex flex-row items-center gap-2">
                        <div className="font-medium">
                          {nApplications.length} đơn ứng tuyển cũ hơn 20 ngày
                        </div>
                        <Separator orientation="vertical" />
                        <Button variant="link">Lưu trữ tất cả</Button>
                      </div>
                      <Button variant="ghost">Hiện tất cả</Button>
                    </div>
                  );
                })()}
              </div>
            ))}
            {/* {initialApplications.map((a, i) => (<ApplicationItem key={i} ma={a} />))} */}
          </div>
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="archived"></Tabs.Content>
      </Tabs.Root>
      <div className="w-full flex flex-row justify-center">
        <Button variant="outline">Xem thêm</Button>
      </div>
    </Fragment>
  );
};
