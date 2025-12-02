import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

async function fetchDetail(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/borrowings/${id}`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return json.data || null;
}

export default async function BorrowDetailPage({ params }) {
  const { id } = await params; 
  const session = await getServerSession(authOptions);
  if (!session) return "Unauthorized";

  const detail = await fetchDetail(id);
  if (!detail) return "Not found";

  const cover = detail.book_cover;

  return (
    <div className="w-full max-w-[950px] mx-auto space-y-10">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">Borrowing Detail</h1>

      {/* TOP SECTION */}
      <div className="flex flex-col sm:flex-row gap-8">

        {/* LEFT COVER */}
        <div className="w-full sm:w-[300px]">
          <div className="relative w-full h-full aspect-[3/4] rounded-md overflow-hidden bg-muted shadow">
            <Image
              src={cover ? `/img/book_img/${cover}` : "/img/default_book.jpg"}
              alt={detail.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* RIGHT DETAIL */}
        <div className="flex-1 p-4 rounded-md bg-card shadow space-y-4">

          {/* TITLE + STATUS */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{detail.title}</h2>
              {detail.author && (
                <p className="text-muted-foreground">{detail.author}</p>
              )}
            </div>

            <Badge className="capitalize">
              {detail.status}
            </Badge>
          </div>

          {/* INFO */}
          <Detail label="Borrowed" value={formatDate(detail.borrow_date)} />
          <Detail label="Return by" value={formatDate(detail.return_date)} />

          {detail.actual_return && (
            <Detail
              label="Returned"
              value={formatDate(detail.actual_return)}
            />
          )}

          <Detail label="Pages" value={detail.total_pages || "—"} />
          <Detail label="Publisher" value={detail.publisher || "—"} />
          <Detail label="Language" value={detail.language || "—"} />
          <Detail label="Rack Code" value={detail.rack_code || "—"} />

        </div>
      </div>

      {/* DESCRIPTION / NOTES */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Borrowing Notes</h2>
        <p className="text-muted-foreground leading-relaxed">
          This page shows the detailed history for this borrowing request. 
          You can check the borrowing date, return deadline, and the 
          current status of the book.
        </p>
      </div>

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatDate(date) {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-GB");
  } catch {
    return "—";
  }
}
