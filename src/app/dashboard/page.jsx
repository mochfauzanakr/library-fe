// note:i can't make a chart so there's no chart unfortunately :<
import { headers } from "next/headers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Clock,
  ClipboardList,
} from "lucide-react";

/* ---------------- FETCH FUNCTION ---------------- */
async function fetchData() {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000";

  const headerList = await headers();
  const cookieHeader = headerList?.get("cookie");

  async function get(path) {
    try {
      const res = await fetch(`${base}${path}`, {
        cache: "no-store",
        headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      });
      if (!res.ok) return null;
      return await res.json().catch(() => null);
    } catch {
      return null;
    }
  }

  const [books, categories, users, borrows] = await Promise.all([
    get("/api/books"),
    get("/api/categories"),
    get("/api/admin/users"),
    get("/api/admin/borrows"),
  ]);

  const borrowsData = Array.isArray(borrows?.data) ? borrows.data : [];

  // Today
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const borrowedToday = borrowsData.filter(
    (b) =>
      b.status === "approved" &&
      b.borrow_date?.slice(0, 10) === today
  ).length;

  const overdueBooks = borrowsData.filter(
    (b) => b.status === "late"
  ).length;

  const activeBorrowers = new Set(
    borrowsData.filter((b) => b.status === "approved").map((b) => b.user_id)
  ).size;

  const pendingRequests = borrowsData.filter(
    (b) => b.status === "pending"
  ).length;

  const returnedToday = borrowsData.filter(
    (b) =>
      b.status === "return" &&
      b.actual_return?.slice(0, 10) === today
  ).length;

  // Simple last 7 days bar chart calculation
  const chart = [0, 0, 0, 0, 0, 0, 0];
  for (const b of borrowsData) {
    if (!b.borrow_date) continue;
    const dayIndex = new Date(b.borrow_date).getDay();
    chart[dayIndex] += 1;
  }

  return {
    books: books?.data?.length || 0,
    categories: categories?.data?.length || 0,
    users: users?.data?.length || 0,
    borrowedToday,
    activeBorrowers,
    overdueBooks,
    pendingRequests,
    returnedToday,
    chart,
  };
}

  /* ---------------- MAIN PAGE ---------------- */
export default async function DashboardPage() {
  const data = await fetchData();
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-10">
      {/* ---------------- WELCOME ---------------- */}
      <section>
        <h1 className="text-4xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Here is the latest activity in your library.</p>
      </section>

      {/* ---------------- TOP STATS ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Books */}
        <Card className="rounded-2xl shadow-sm border bg-[#E8F3FF]">
          <CardHeader className="pb-2 flex flex-row justify-between">
            <CardTitle className="text-muted-foreground">Total Books</CardTitle>
            <BookOpen className="w-5 h-5 text-[#3B82F6]" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#1E3A8A]">{data.books}</p>
          </CardContent>
        </Card>

        {/* Borrowed Today */}
        <Card className="rounded-2xl shadow-sm border bg-[#FFF7E6]">
          <CardHeader className="pb-2 flex flex-row justify-between">
            <CardTitle className="text-muted-foreground">Borrowed Today</CardTitle>
            <ClipboardList className="w-5 h-5 text-[#EAB308]" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#B45309]">{data.borrowedToday}</p>
          </CardContent>
        </Card>

        {/* Active Borrowers */}
        <Card className="rounded-2xl shadow-sm border bg-[#E9FFE8]">
          <CardHeader className="pb-2 flex flex-row justify-between">
            <CardTitle className="text-muted-foreground">Active Borrowers</CardTitle>
            <Users className="w-5 h-5 text-[#16A34A]" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#166534]">{data.activeBorrowers}</p>
          </CardContent>
        </Card>

        {/* Overdue Books */}
        <Card className="rounded-2xl shadow-sm border bg-[#FFE8E8]">
          <CardHeader className="pb-2 flex flex-row justify-between">
            <CardTitle className="text-muted-foreground">Overdue Books</CardTitle>
            <Clock className="w-5 h-5 text-[#DC2626]" />
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-[#991B1B]">{data.overdueBooks}</p>
          </CardContent>
        </Card>

      </div>
      {/* ---------------- QUICK STATUS ---------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Card className="rounded-xl shadow-sm border bg-[#EEF2FF]">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Requests</p>
            <p className="text-2xl font-bold text-[#3730A3] mt-1">{data.pendingRequests}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border bg-[#ECFDF5]">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Returned Today</p>
            <p className="text-2xl font-bold text-[#047857] mt-1">{data.returnedToday}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border bg-[#FEF3C7]">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Categories</p>
            <p className="text-2xl font-bold text-[#B45309] mt-1">{data.categories}</p>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border bg-[#FFE4E6]">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-bold text-[#BE123C] mt-1">{data.users}</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
