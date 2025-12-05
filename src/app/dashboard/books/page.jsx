import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function BooksPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`, {
    cache: "no-store",
  });
  const json = await res.json();
  const books = json.data || [];
  const total = books.length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Books (view only)</h1>
          <p className="text-muted-foreground">Koleksi buku perpustakaan.</p>
        </div>
        <span className="text-sm text-muted-foreground">Total: {total}</span>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {books.map((b) => (
          <Card
            key={b.id_book}
            className="rounded-2xl shadow-sm border transition hover:shadow-md hover:bg-muted/40"
          >
            {/* IMAGE */}
            <div className="relative w-full aspect-[3/4] rounded-t-2xl overflow-hidden bg-muted">
              <Image
                src={`/img/book_img/${b.book_cover}`}
                alt={b.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
              />

              {/* STOCK BADGE */}
              <div className="absolute top-2 right-2 bg-[#3B82F6]/90 text-white text-xs px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">
                Stock: {b.stock}
              </div>
            </div>

            {/* CONTENT */}
            <CardContent className="p-4 space-y-3">

              {/* TITLE */}
              <div>
                <p className="font-semibold line-clamp-2">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.author}</p>
              </div>

              {/* INFO BADGES */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 bg-[#E0EAFF] text-[#1E40AF] rounded-md">
                  {b.category}
                </span>
                <span className="px-2 py-1 bg-[#E8FFE9] text-[#166534] rounded-md">
                  Rack: {b.rack_code}
                </span>
                <span className="px-2 py-1 bg-[#FFF1E0] text-[#B45309] rounded-md">
                  ISBN
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-muted-foreground line-clamp-3">
                {b.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
