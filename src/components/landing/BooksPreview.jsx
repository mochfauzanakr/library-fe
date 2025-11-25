"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function BooksPreview() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/books?limit=8");
      const data = await res.json();
      setBooks(data);
    }
    load();
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Buku Terbaru
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {books.map((book) => (
            <Card key={book.id_book} className=" hover:shadow-xl transition p-0">
              <CardHeader className="p-0">
                <div className="w-full aspect-[3/4] relative rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={`/img/book_img/${book.book_cover}`}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>

              </CardHeader>

              <CardContent className="p-4">
                <p className="text-sm text-blue-600 font-medium mb-1">
                  {book.category}
                </p>
                <CardTitle className="text-lg">{book.title}</CardTitle>

                <a
                  href={`/register`}
                  className="mt-4 inline-block text-primary underline text-sm hover:text-primary/80"
                >
                  Lihat Detail →
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
