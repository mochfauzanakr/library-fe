"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Topbar({ title, search }) {
  const { data: session } = useSession();
  const username = session?.user?.username;
  const initial = username?.[0]?.toUpperCase() || "?";

  return (
    <header className="h-16 border-b flex items-center justify-between px-6 bg-background sticky top-0 z-20">
      <h1 className="text-lg font-semibold tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {search}
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full focus:outline-none">
            <Avatar className="h-9 w-9 border">
              <AvatarFallback>{initial}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 text-red-500">
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
