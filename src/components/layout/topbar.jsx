"use client";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export default function Topbar({ role }) {
  const { data: session } = useSession();
  const username = session?.user?.username;
  const initial = username?.[0]?.toUpperCase() || "?";

  return (
    <header className="h-16 border-b flex items-center px-4 gap-4 bg-background sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1">
        <Input placeholder="Search books..." />
      </div>

      {/* Profile */}
      <Avatar className="h-9 w-9">
        <AvatarFallback>{initial}</AvatarFallback>
      </Avatar>
    </header>
  );
}
