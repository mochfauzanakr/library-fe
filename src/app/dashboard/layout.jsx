"use client";

import { useSession } from "next-auth/react";
import AppLayout from "@/components/layout/AppLayout";
import { SessionProvider } from "@/components/providers/SessionProvider";
import DashboardSearch from "@/components/layout/search/DashboardSearch";
import Topbar from "@/components/layout/topbar";

export default function DashboardLayout({ children }) {
  return (
    <SessionProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </SessionProvider>
  );
}

function DashboardLayoutInner({ children }) {
  const { data } = useSession();
  const role = data?.user?.role;

  return (
    <AppLayout
      role={role}
      topbar={<Topbar title="Dashboard" search={<DashboardSearch />} />}
    >
      {children}
    </AppLayout>
  );
}