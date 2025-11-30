"use client";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./topbar";

export default function AppLayout({ role, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  if (!loaded) return <div />;

  // optimum untuk viewport sempit (scaling 150%)
  const sidebarWidth = collapsed ? 48 : 160; // px

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      
      {/* Sidebar */}
      <Sidebar
        role={role}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN SIDE */}
      <div
        className="flex flex-col flex-1"
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.3s ease",
        }}
      >
        <Topbar role={role} />

        <main className="p-4 sm:p-6 max-w-full overflow-x-hidden">
          <div className="w-full max-w-[1100px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
