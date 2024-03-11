"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();

  return (
    <div>
      <h1>Billing History</h1>
      <Button variant="link" onClick={() => router.push("/manage/my-account/billing/deposit")}>Nạp tiền</Button>
    </div>
  );
};
