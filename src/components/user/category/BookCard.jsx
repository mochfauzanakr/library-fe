"use client";

import Image from "next/image";
import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <Link
      href={`/user/books/${book.id_book}`}
      className="block border border-neutral-200 rounded-lg overflow-hidden hover:bg-neutral-50 transition"
    >
      <div className="relative aspect-[3/4] w-full bg-white flex items-center justify-center">
        <Image
          src={`/img/book_img/${book.book_cover}`}
          alt={book.title}
          fill
          className="object-contain"
        />
      </div>

      <div className="p-3 space-y-1">
        <p className="text-sm font-medium truncate">{book.title}</p>
        <p className="text-xs text-neutral-500 truncate">{book.author}</p>
        <p className="text-xs text-neutral-400">{book.original_year || "—"}</p>
      </div>
    </Link>

  );
}
