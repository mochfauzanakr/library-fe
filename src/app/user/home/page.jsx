

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
  const [allBooksRes, newBooksRes, catRes] = await Promise.all([
    api("/api/books?limit=12"),
    api("/api/newBooks?limit=8"),
    api("/api/categories"),
  ]);

  const allBooks = allBooksRes?.data || [];
  const newBooks = newBooksRes?.data || [];
  const categories = catRes?.data || [];

  return (
    <div className="w-full max-w-[950px] mx-auto space-y-10">

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
        <section className="space-y-3 overflow-hidden">
          <h2 className="text-xl font-semibold">New Arrivals</h2>

          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full relative overflow-hidden"
          >
            <CarouselContent>
              {newBooks.slice(0, 8).map((book) => (
                <CarouselItem
                  key={book.id_book}
                  className="basis-1/2 sm:basis-1/3 lg:basis-1/4"
                >
                  <Link href={`/user/books/${book.id_book}`}>
                    <Card className="hover:bg-accent transition cursor-pointer mx-auto w-full">
                      <CardContent className="p-3">
                        <div className="w-full h-40 bg-white rounded-md overflow-hidden flex items-center justify-center">
                          <Image
                            src={`/img/book_img/${book.book_cover}`}
                            alt={book.title}
                            width={200}
                            height={300}
                            className="object-contain w-full h-full"
                          />
                        </div>

                        <p className="font-semibold mt-2 text-sm truncate">{book.title}</p>

                        <p className="text-xs text-muted-foreground truncate">
                          {book.author ? book.author : "Unknown Author"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {book.original_year ? book.original_year : "—"}
                        </p>
                      </CardContent>
                    </Card>

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
      {/* All Books */}
      <section className="py-10">
        <div className="mx-auto px-4 space-y-6">
          <h2 className="text-xl font-semibold">All Books</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {allBooks.map((book) => (
              <Link
                key={book.id_book}
                href={`/user/books/${book.id_book}`}
                className="block"
              >
                <Card className="transition hover:shadow-lg cursor-pointer p-0">
                  <CardHeader className="p-0">
                    <div className="w-full aspect-[3/4] relative overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={`/img/book_img/${book.book_cover}`}
                        alt={book.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 space-y-1.5">

                    <p className="text-xs text-muted-foreground truncate">
                      {book.category}
                    </p>

                    <CardTitle className="text-sm font-semibold truncate leading-tight">
                      {book.title}
                    </CardTitle>

                    <p className="text-xs truncate">{book.author}</p>

                    <p className="text-[11px] text-muted-foreground">
                      {book.original_year || "—"}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
