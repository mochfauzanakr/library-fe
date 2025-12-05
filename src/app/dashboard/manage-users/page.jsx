import { headers } from "next/headers";
import UserTable from "@/components/admin/users/UserTable";

async function fetchUsers() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  const headerList = await headers();
  const cookieHeader = headerList?.get("cookie");

  const res = await fetch(`${baseUrl}/api/admin/users?page=1&limit=20`, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (!res.ok) return { data: [], meta: null };

  const json = await res.json();
  return json;
}

export default async function ManageUsersPage() {
  const { data, meta } = await fetchUsers();
  const safeUsers = Array.isArray(data) ? data.filter(Boolean) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage registered users.
        </p>
      </div>

      <UserTable users={safeUsers} meta={meta || undefined} />
    </div>
  );
}
