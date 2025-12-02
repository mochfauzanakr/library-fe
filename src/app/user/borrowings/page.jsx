import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import EmptyPage from "@/components/empty";
import { Library } from "lucide-react";
import BorrowCard from "@/components/user/borrow/borrowCard";

async function fetchBorrowings(userId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/borrowings?user_id=${userId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return [];

  const json = await res.json();
  return json.data || [];
}

export default async function BorrowingPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) return <div className="p-6">Unauthorized.</div>;

  const items = await fetchBorrowings(userId);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Borrowing History</h1>

      {items.length === 0 && (
        <EmptyPage
          icon={<Library className="w-12 h-12 text-muted-foreground" />}
          title="No Borrowing History"
          description="You haven't borrowed any books yet."
        />

      )}

      <div className="space-y-4">
        {items.map((item) => (
          <BorrowCard key={item.id_borrows} item={item} />
        ))}
      </div>
    </div>
  );
}
