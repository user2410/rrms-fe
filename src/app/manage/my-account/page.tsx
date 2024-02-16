"use client";

import * as Tabs from '@radix-ui/react-tabs';
import styles from "./_styles/page.module.css";
import clsx from 'clsx';
import AccountTab from './_components/account_tab';
import NotificationTab from './_components/notification_tab';

export default function MyAccountPage() {
  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        <h1 className="text-2xl lg:text-3xl font-light">Thiết đặt tài khoản</h1>
      </div>
      <Tabs.Root defaultValue="account" className={styles.TabsRoot}>
        <Tabs.List className={styles.TabsList}>
          <Tabs.Trigger value="account" className={clsx(styles.TabsTrigger, "!focus:ring-0")}>Tài khoản</Tabs.Trigger>
          <Tabs.Trigger value="notification" className={clsx(styles.TabsTrigger, "!focus:ring-0")}>Thông báo</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content defaultChecked className={styles.TabsContent} value="account">
          <AccountTab />
        </Tabs.Content>
        <Tabs.Content className={styles.TabsContent} value="notification">
          <NotificationTab />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
