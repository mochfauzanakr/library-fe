

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

async function api(endpoint) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`, {
    cache: "no-store",
  });
  return res.ok ? res.json() : null;
}

export default async function UserHomePage() {
  const [allBooksRes, newBooksRes, catRes] = await Promise.all([
    api("/api/books?limit=12"),
    api("/api/newBooks?limit=12"),
    api("/api/categories"),
  ]);

  const allBooks = allBooksRes?.data || [];
  const newBooks = newBooksRes?.data || [];
  const categories = catRes?.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-10">

      <h1 className="text-3xl font-bold">Welcome to the Library</h1>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Categories</h2>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <span
                key={c.id_category}
                className="px-3 py-1 bg-muted rounded-full text-sm cursor-pointer hover:bg-accent transition"
              >
                {c.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* New Books */}
      {newBooks.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">New Arrivals</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {newBooks.map((book) => (
              <Link key={book.id_book} href={`/books/${book.id_book}`}>
                <Card className="hover:bg-accent transition cursor-pointer">
                  <CardContent className="p-3 max-w-[180px] mx-auto">
                    <div className="w-full h-40 bg-white rounded-md overflow-hidden flex items-center justify-center">
                      <Image
                        src={`/img/book_img/${book.book_cover}`}
                        alt={book.title}
                        width={300}
                        height={400}
                        className="object-contain w-full h-full"
                      />
                    </div>

                    <p className="font-semibold mt-2 text-sm truncate">{book.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                    <p className="text-xs text-muted-foreground truncate">{book.category}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Books */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">All Books</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {allBooks.map((book) => (
            <Link key={book.id_book} href={`/books/${book.id_book}`}>
              <Card className="hover:bg-accent transition cursor-pointer">
                <CardContent className="p-3 max-w-[180px] mx-auto">
                  <div className="w-full h-40 bg-white rounded-md overflow-hidden flex items-center justify-center">
                    <Image
                      src={`/img/book_img/${book.book_cover}`}
                      alt={book.title}
                      width={300}
                      height={400}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  <p className="font-semibold mt-2 text-sm truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                  <p className="text-xs text-muted-foreground truncate">{book.category}</p>
                </CardContent>
              </Card>


            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
