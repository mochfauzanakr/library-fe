"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function BorrowCard({ item }) {

  const rawCover = item.book_cover;

const cover =
  typeof rawCover === "string"
    ? rawCover
    : typeof rawCover === "number"
    ? String(rawCover)
    : typeof rawCover === "object" && rawCover !== null
    ? rawCover.book_cover || null
    : null;
    console.log("🔥 RAW COVER DATA:", item.book_cover);

    console.log("COVER VALUE:", cover);


  return (
    <Card className="border shadow-sm hover:shadow-md transition">
      <CardContent className="p-4">
        <Link href={`/user/borrowings/${item.id_borrows}`} className="absolute inset-0 z-10"></Link>
        <div className="flex gap-5">

          {/* Book Cover */}
          <div className="relative w-[90px] h-[130px] rounded-md overflow-hidden bg-muted">
            <Image
              fill
              src={cover ? `/img/book_img/${cover}` : "/img/default_book.png"}
              alt={item.title}
              className="object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold leading-tight">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground">{item.author}</p>
              </div>

              <StatusBadge status={item.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <Detail label="Borrowed" value={formatDate(item.borrow_date)} />
              <Detail label="Return by" value={formatDate(item.return_date)} />

              {item.actual_return_date && (
                <Detail
                  label="Returned"
                  value={formatDate(item.actual_return_date)}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }) {
  return (
    <p className="text-sm">
      <span className="text-muted-foreground">{label}:</span>{" "}
      <span className="font-medium">{value}</span>
    </p>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-yellow-500 text-black hover:bg-yellow-600",
    approved: "bg-blue-600 text-white hover:bg-blue-700",
    late: "bg-red-600 text-white hover:bg-red-700",
    returned: "bg-green-600 text-white hover:bg-green-700",
    rejected: "bg-gray-400 text-white hover:bg-gray-500",
  };

  return (
    <Badge
      className={`px-2 py-1 text-[10px] font-semibold rounded-md ${
        colors[status] || "bg-gray-300 text-black"
      }`}
    >
      {status.toUpperCase()}
    </Badge>
  );
}

function formatDate(date) {
  try {
    return new Date(date).toLocaleDateString("en-GB");
  } catch {
    return "-";
  }
}
