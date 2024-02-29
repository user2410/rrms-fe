"use client";

import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";
import ApplicationToMe from "./_components/application_to-me";
import styles from "./_styles/application_list.module.css";

export default function ApplicationPage() {
  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <h1 className="text-2xl lg:text-3xl font-light">Đăng kí ứng tuyển</h1>
        <Tabs.Root defaultValue="to-me" className={styles.TabsRoot}>
          <Tabs.List className={styles.TabsList}>
            <Tabs.Trigger value="to-me" className={clsx(styles.TabsTrigger, "!focus:ring-0")}>Xét duyệt</Tabs.Trigger>
            <Tabs.Trigger value="mine" className={clsx(styles.TabsTrigger, "!focus:ring-0")}>Của tôi</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className={styles.TabsContent} value="to-me">
            <ApplicationToMe/>
          </Tabs.Content>
          <Tabs.Content className={styles.TabsContent} value="mine">

          </Tabs.Content>
        </Tabs.Root>
      </div>

    </div>
  );
};
