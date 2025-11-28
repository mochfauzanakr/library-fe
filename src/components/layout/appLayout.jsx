"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./topbar";

export default function AppLayout({ role, children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex bg-background text-foreground">

      {/* Desktop sidebar */}
      <Sidebar role={role} collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN area */}
      <div
        className={`
          flex-1 min-h-screen transition-all duration-300 
          ${collapsed ? "ml-20" : "ml-64"} 
        `}
      >
        <Topbar role={role} />

        <main className="max-w-7xl mx-auto w-full p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
