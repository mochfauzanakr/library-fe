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
  ClipboardList,
} from "lucide-react";

// ————————————————————————————————————————————————
// FIXED MENU DATA
// Semua href diseragamkan untuk dashboard admin/staff
// ————————————————————————————————————————————————
const MENU = {
  admin: [
    {
      title: "Main",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/dashboard/books", label: "Books", icon: Book },
        { href: "/dashboard/categories", label: "Categories", icon: Folder },
      ],
    },
    {
      title: "Management",
      items: [
        { href: "/dashboard/manage-users", label: "Manage Users", icon: Users },
        { href: "/dashboard/manage-books", label: "Manage Books", icon: Library },
        { href: "/dashboard/manage-staff", label: "Manage Staff", icon: UserRoundCog },
        { href: "/dashboard/borrows", label: "Borrow Records", icon: ClipboardList },
      ],
    },

  ],

  staff: [
    {
      title: "Main",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: Home },
        { href: "/dashboard/books", label: "Books", icon: Book },
        { href: "/dashboard/categories", label: "Categories", icon: Folder },
      ],
    },
    {
      title: "Management",
      items: [
        { href: "/dashboard/manage-users", label: "Users", icon: Users },
        { href: "/dashboard/manage-books", label: "Manage Books", icon: Library },
        { href: "/dashboard/borrows", label: "Borrow Records", icon: ClipboardList },
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

// ————————————————————————————————————————————————
// FIXED ICON WRAPPER
// Semua ikon dijamin memiliki ukuran box yang sama
// ————————————————————————————————————————————————
function IconWrapper({ Icon }) {
  return (
    <div className="w-5 h-5 flex items-center justify-center">
      <Icon className="w-5 h-5" />
    </div>
  );
}

// ————————————————————————————————————————————————
// MAIN SIDEBAR
// ————————————————————————————————————————————————
export default function Sidebar({ role, collapsed, setCollapsed }) {
  const config = MENU[role] || MENU.user;

  return (
    <Collapsible
      open={!collapsed}
      onOpenChange={() => setCollapsed(!collapsed)}
      className={`min-h-screen border-r bg-muted/40 fixed left-0 top-0 z-40
        transition-all duration-300 ${collapsed ? "w-14" : "w-40"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && <h1 className="font-bold text-lg">Library</h1>}
        <CollapsibleTrigger className="p-2 rounded hover:bg-muted">
          <Menu size={20} />
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
                    <IconWrapper Icon={m.icon} />
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
