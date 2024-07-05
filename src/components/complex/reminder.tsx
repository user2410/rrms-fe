"use client";

import { useFetchReminders } from "@/hooks/use-reminder";

export default function ReminderComponent() {
  useFetchReminders();
  
  return (<></>);
};

