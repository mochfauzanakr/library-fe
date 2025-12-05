import { headers } from "next/headers";

async function fetchBorrowHistory(id) {
  if (!id) return [];
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const headerList = await headers();
    const cookieHeader = headerList?.get("cookie");

    const res = await fetch(`${baseUrl}/api/admin/users/${id}/borrow-history`, {
      cache: "no-store",
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
    });

    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  } catch (err) {
    console.error("fetchBorrowHistory error:", err);
    return [];
  }
}

export default async function UserBorrowHistoryPage(props) {
  const { id } = props?.params ? await props.params : {};
  const history = await fetchBorrowHistory(id);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Borrow History</h1>
        <p className="text-muted-foreground">
          Riwayat peminjaman untuk user #{id}
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Book</th>
              <th className="p-2 text-left">Borrowed At</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Returned At</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length ? (
              history.map((row) => (
                <tr
                  key={row.id_borrows ?? `${row.title}-${row.borrow_date || "unknown"}`}
                  className="border-t"
                >
                  <td className="p-2">{row.title}</td>
                  <td className="p-2">
                    {row.borrow_date
                      ? new Date(row.borrow_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2">
                    {row.due_date
                      ? new Date(row.due_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2">
                    {row.return_date
                      ? new Date(row.return_date).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-2 capitalize">{row.status || "—"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-muted-foreground">
                  No borrow history found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
