"use client";

import { Button } from "@/components/ui/button";
import { Fragment, useState } from "react";
import { ManagedProperty } from "../page";
import PropertyCard from "./property_card";
import * as Tabs from '@radix-ui/react-tabs';
import styles from "./propertie_grid.module.css";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// type PropertyTab = "active" | "archived" | "draft";

export default function PropertiesGrid({
  initialProperties
}: {
  initialProperties: ManagedProperty[];
}) {
  return (
    <Fragment>
      <div className="flex flex-row justify-between w-full">
        <h2>Hiển thị {initialProperties.length} nhà cho thuê</h2>
        <div className="flex flex-row items-center gap-2">
          <span className="text-sm font-light whitespace-nowrap">Sắp xếp theo</span>
          <Select defaultValue="name">
            <SelectTrigger className="border-0 focus:ring-0 focus:ring-offset-0 bg-transparent gap-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="name">Tên</SelectItem>
                <SelectItem value="createdAt">Thời gian tạo</SelectItem>
                <SelectItem value="updatedAt">Thời gian cập nhật</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Tabs.Root defaultValue="active" className={styles.TabsRoot}>
        <Tabs.List className={styles.TabsList}>
          <Tabs.Trigger value="active" className={styles.TabsTrigger}>Active</Tabs.Trigger>
          <Tabs.Trigger value="archived" className={styles.TabsTrigger}>Archived</Tabs.Trigger>
          <Tabs.Trigger value="draft" className={styles.TabsTrigger}>Draft</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content className={styles.TabsContent} value="active">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {initialProperties.map((p, i) => (
              <PropertyCard key={i} property={p.property}></PropertyCard>
            ))}
          </div>
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="archived"></Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="draft"></Tabs.Content>
      </Tabs.Root>
      <div className="w-full flex flex-row justify-center">
        <Button variant="outline">Xem thêm</Button>
      </div>
    </Fragment>
  );
};
