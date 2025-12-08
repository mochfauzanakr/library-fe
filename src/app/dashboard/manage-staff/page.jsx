import AddStaffModal from "@/components/admin/staff/modals/AddStaffModal";
import StaffActions from "@/components/admin/staff/StaffAction";
import { headers } from "next/headers";

async function getStaff() {
  const headerList = await headers();
  const cookieHeader = headerList?.get("cookie");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/staff`,
    {
      cache: "no-store",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    }
  );

  if (!res.ok) {
    console.error("Failed to fetch staff", res.status);
    return [];
  }

  const { data } = await res.json();
  return data;
}

export default async function ManageStaffPage() {
  const staff = await getStaff();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Staff</h1>

        {/* Modal Add Staff */}
        <AddStaffModal />
      </div>

      {/* Table */}
      <div className="border rounded bg-white p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-left">username</th>
              <th className="py-2 text-left">Email</th>
              <th className="py-2 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {staff.length > 0 ? (
              staff.map((s) => (
                <tr key={s.id_user} className="border-b">
                  <td className="py-2">{s.username}</td>
                  <td className="py-2">{s.email}</td>
                  <td className="py-2 capitalize">{s.role}</td>
                  <td className="py-2">
                    <StaffActions staff={s} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-6 text-center text-muted-foreground">
                  No staff registered.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
