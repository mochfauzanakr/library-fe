"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import {
  Home,
  Book,
  Bookmark,
  Folder,
  Users,
  UserRoundCog,
  Library,
  Menu,
  ListChecks,
  Clipboard,
  ClipboardList,
} from "lucide-react";

const MENU = {
  admin: [
    {
      title: "Main",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/books", label: "Books", icon: Book },
        { href: "/categories", label: "Categories", icon: Folder },
      ],
    },
    {
      title: "Management",
      items: [
        { href: "/dashboard/manage-users", label: "Manage Users", icon: Users },
        { href: "/dashboard/manage-books", label: "Manage Books", icon: Library },
        { href: "/dashboard/manage-staff", label: "Manage Staff", icon: UserRoundCog },
      ],
    },
  ],

  staff: [
    {
      title: "Main",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/books", label: "Books", icon: Book },
        { href: "/categories", label: "Categories", icon: Folder },
      ],
    },
    {
      title: "Management",
      items: [
        { href: "/dashboard/manage-users", label: "Users", icon: Users },
        { href: "/dashboard/manage-books", label: "Manage Books", icon: Library },
      ],
    },
  ],

  user: [
    {
      title: "Menu",
      items: [
        { href: "/user/home", label: "Home", icon: Home },
        { href: "/user/books", label: "Books", icon: Book },
        { href: "/user/wishlist", label: "Wishlist", icon: Bookmark },
        { href: "/user/categories", label: "Categories", icon: Folder },
        { href: "/user/borrowings", label: "Borrow History", icon: ClipboardList },
      ],
    },
  ],
};

export default function Sidebar({ role, collapsed, setCollapsed }) {
  const config = MENU[role] || MENU.user;

  return (
    <Collapsible
      open={!collapsed}
      onOpenChange={() => setCollapsed(!collapsed)}
      className={`
        min-h-screen border-r bg-muted/40 fixed left-0 top-0 z-40
  transition-all duration-300 
        ${collapsed ? "w-14" : "w-40"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h1 className="font-bold text-lg">Library</h1>}
        <CollapsibleTrigger className="p-2 rounded hover:bg-muted">
          <Menu size={20}/>
        </CollapsibleTrigger>
      </div>

      {/* Menu */}  
      <CollapsibleContent className="overflow-hidden">
        <nav className="px-4 py-3 flex flex-col gap-6">
          {config.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
                  {section.title}
                </p>
              )}

              <div className="flex flex-col gap-1">
                {section.items.map((m) => (
                  <Link
                    href={m.href}
                    key={m.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition"
                  >
                    <m.icon size={20} />
                    {!collapsed && <span>{m.label}</span>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </CollapsibleContent>
    </Collapsible>
  );
}
