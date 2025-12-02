"use client";

import { useState, useMemo } from "react";
import Categories from "./category/BookCard";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FilteredBooks({ categories, books }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredBooks = useMemo(() => {
    if (!selectedCategory) return books;
    return books.filter((b) => b.category === selectedCategory);
  }, [books, selectedCategory]);

  return (
    <div className="space-y-6">
      
      {/* CATEGORIES */}
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Categories</h2>
        <Categories categories={categories} onSelect={setSelectedCategory} />
      </section>

      {/* BOOKS */}
      <section className="pt-4">
        <h2 className="text-xl font-semibold">
          {selectedCategory ? `Books in ${selectedCategory}` : "All Books"}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredBooks.map((book) => (
            <Link key={book.id_book} href={`/user/books/${book.id_book}`}>
              <Card className="hover:shadow-lg transition p-0">
                <CardHeader className="p-0">
                  <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-muted">
                    <Image
                      src={`/img/book_img/${book.book_cover}`}
                      alt={book.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-3 space-y-1">
                  <p className="text-xs text-muted-foreground truncate">{book.category}</p>
                  <CardTitle className="text-sm font-semibold truncate">{book.title}</CardTitle>
                  <p className="text-xs truncate">{book.author}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
