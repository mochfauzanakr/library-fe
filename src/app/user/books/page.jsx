// src/app/user/books/page.jsx

import Link from "next/link";
import Image from "next/image";

async function fetchBooks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books`, {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data || [];
}

export default async function BooksPage() {
  const books = await fetchBooks();

  return (
    <div className="w-full max-w-[950px] mx-auto space-y-8">
      <h1 className="text-2xl font-bold">All Books</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <Link
            key={book.id_book}
            href={`/user/books/${book.id_book}`}
            className="block"
          >
            <div className="rounded-md overflow-hidden bg-gray-100 shadow hover:shadow-lg transition cursor-pointer">
              <div className="relative aspect-[3/4] w-full bg-white">
                <Image
                  src={`/img/book_img/${book.book_cover}`}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-3">
                <p className="text-xs text-muted-foreground truncate">
                  {book.category}
                </p>

                <p className="font-semibold text-sm truncate">{book.title}</p>
                <p className="text-xs truncate">{book.author}</p>
                <p className="text-xs text-muted-foreground">
                  {book.original_year || "—"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
