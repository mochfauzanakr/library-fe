"use client";

import Image from "next/image";
import { BookmarkX } from "lucide-react";
import BorrowButton from "./BorrowButton";

export default function WishlistPage({ items = [] }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8 py-10">
      <h1 className="text-3xl font-bold">My Wishlist</h1>

      <div className="space-y-6">
        {items.length === 0 && (
          <p className="text-muted-foreground text-lg">
            Your wishlist is empty.
          </p>
        )}

        {items.map((book) => (
          <div
            key={book.id_wishlist}
            className="flex items-center gap-6 p-5 bg-card rounded-xl shadow hover:shadow-lg transition border border-border"
          >
            {/* COVER — Bigger */}
            <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-muted shadow">
              <Image
                src={`/img/book_img/${book.book_cover}`}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>

            {/* INFO bigger */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="font-semibold text-lg truncate">{book.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {book.author}
              </p>
              <p className="text-xs text-muted-foreground">
                {book.original_year || "—"}
              </p>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex flex-col items-end gap-2 min-w-[110px]">
              {/* STOCK */}
              {book.stock > 0 ? (
                <span className="text-xs font-medium px-3 py-1 bg-green-500 text-white rounded-full">
                  Available
                </span>
              ) : (
                <span className="text-xs font-medium px-3 py-1 bg-gray-300 text-gray-700 rounded-full">
                  Out of Stock
                </span>
              )}

              {/* Borrow */}
              {book.stock > 0 && (
                <BorrowButton bookId={book.id_book}   // ← INI WAJIB ADA
                  stock={book.stock} />
              )}

              {/* Remove */}
              <button className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1">
                <BookmarkX size={16} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
