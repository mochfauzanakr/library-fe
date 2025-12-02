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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {books.map((book) => (
            <Link
              key={book.id_book}
              href={`/user/books/${book.id_book}`}
              className="block border border-neutral-200 rounded-md hover:bg-neutral-50 transition overflow-hidden"
            >
              <div className="w-full aspect-[3/4] bg-white rounded-md overflow-hidden flex items-center justify-center">
                <Image
                  src={`/img/book_img/${book.book_cover}`}
                  alt={book.title}
                  width={160}
                  height={240}
                  className="object-contain"
                />
              </div>

              <div className="p-3 space-y-1">
                <p className="text-xs text-neutral-500 truncate">{book.category}</p>
                <p className="text-sm font-medium truncate">{book.title}</p>
                <p className="text-xs truncate">{book.author}</p>
                <p className="text-[11px] text-neutral-400">
                  {book.original_year || "—"}
                </p>
              </div>
            </Link>
          ))}
        </div>
  );
}
