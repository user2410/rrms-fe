"use client";

import * as Tabs from '@radix-ui/react-tabs';
import { useSession } from 'next-auth/react';
import ExpensesTab from './_components/expenses_tab';
import IncomesTab from './_components/incomes_tab';
import TopCard from './_components/top_card';

export default function PaymentPage() {
  const session = useSession();
  
  return (
    <div className="container h-full py-10">
      <div className="space-y-4">
        {session.status === "authenticated" && (
          <TopCard sessionData={session.data!} />
        )}
        <Tabs.Root defaultValue="expenses" className="TabsRoot">
          <Tabs.List className="TabsList">
            <Tabs.Trigger className="TabsTrigger" value="expenses">Khoản chi</Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="incomes">Khoản thu</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content className="TabsContent" value="expenses">
            {session.status === "authenticated" && (
              <ExpensesTab sessionData={session.data!} />
            )}
          </Tabs.Content>
          <Tabs.Content className="TabsContent" value="incomes">
            {session.status === "authenticated" && (
              <IncomesTab sessionData={session.data!} />
            )}
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
};
