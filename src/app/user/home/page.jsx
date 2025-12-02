import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const BASE_URL =
  (process.env.NEXT_PUBLIC_BASE_URL &&
    process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")) ||
  "";

async function api(endpoint) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    cache: "no-store",
  });
  return res.ok ? res.json() : null;
}

export default async function UserHomePage() {
  const [BooksRes, newBooksRes,] = await Promise.all([
    api("/api/books?random=true&limit=10"),
    api("/api/newBooks?limit=8"),

  ]);

  const Books = BooksRes?.data || [];
  const newBooks = newBooksRes?.data || [];

  return (
    <div className="w-full max-w-[950px] mx-auto space-y-12">

      <h1 className="text-3xl font-semibold">Welcome to the Library</h1>

      {/* New Arrivals */}
      {newBooks.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">New Arrivals</h2>

          <Carousel
            opts={{ align: "start", loop: false }}
            className="w-full relative"
          >
            <CarouselContent>
              {newBooks.slice(0, 8).map((book) => (
                <CarouselItem
                  key={book.id_book}
                  className="basis-1/2 sm:basis-1/3 lg:basis-1/5"
                >
                  <Link href={`/user/books/${book.id_book}`}>
                    <div className="border border-neutral-200 rounded-md overflow-hidden hover:bg-neutral-50 transition p-3">

                      <div className="w-full aspect-[3/4] bg-white rounded-md overflow-hidden flex items-center justify-center">
                        <Image
                          src={`/img/book_img/${book.book_cover}`}
                          alt={book.title}
                          width={160}
                          height={240}
                          className="object-contain w-full h-full"
                        />
                      </div>

                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        <p className="text-xs text-neutral-500 truncate">
                          {book.author || "Unknown Author"}
                        </p>
                        <p className="text-xs text-neutral-400">
                        Added At: {new Date(book.added_at).toLocaleDateString()}
                        </p>
                      </div>

                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-0 translate-x-0" />
            <CarouselNext className="right-0 translate-x-0" />
          </Carousel>
        </section>
      )}

      {/* All Books */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Random Books</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {Books.map((book) => (
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
      </section>

    </div>

  );
}
