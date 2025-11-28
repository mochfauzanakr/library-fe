"use client";

import { useSession } from "next-auth/react";
import AppLayout from "@/components/layout/appLayout";

export default function DashboardLayout({ children }) {
  const { data } = useSession();
  const role = data?.user?.role || "user";

  return <AppLayout role={role}>{children}</AppLayout>;
}
