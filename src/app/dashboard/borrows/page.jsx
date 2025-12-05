import { headers } from "next/headers";
import BorrowTable from "@/components/admin/borrows/BorrowTable";

async function fetchBorrows(searchParamsPromise) {
  const paramsObj = searchParamsPromise ? await searchParamsPromise : {};

  const params = new URLSearchParams();
  const page = Number(paramsObj?.page) || 1;
  const status = paramsObj?.status || "";

  params.set("page", page);
  params.set("limit", 20);
  if (status) params.set("status", status);

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  const headerList = await headers();
  const cookieHeader = headerList?.get("cookie");

  const res = await fetch(`${baseUrl}/api/admin/borrows?${params.toString()}`, {
    cache: "no-store",
    headers: cookieHeader ? { cookie: cookieHeader } : undefined,
  });

  if (!res.ok) return { data: [], meta: null };

  const json = await res.json();
  return json;
}

export default async function BorrowRecordsPage({ searchParams }) {
  const { data, meta } = await fetchBorrows(searchParams);
  const safeData = Array.isArray(data) ? data.filter(Boolean) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Borrow Records</h1>
        <p className="text-muted-foreground">
          Review and manage all borrow requests.
        </p>
      </div>

      <BorrowTable borrows={safeData} meta={meta || undefined} />
    </div>
  );
}
