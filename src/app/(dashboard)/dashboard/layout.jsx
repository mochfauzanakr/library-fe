"use client";

import { useSession } from "next-auth/react";
import AppLayout from "@/components/layout/AppLayout";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function DashboardLayout({ children }) {
  return (
    <SessionProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SessionProvider>
  );
}

function DashboardLayoutInner({ children }) { 
  const { data } = useSession();
  const role = data?.user?.role || "user";
  return <AppLayout role={role}>{children}</AppLayout>;
}
