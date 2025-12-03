"use client";

import { useState } from "react";
import Image from "next/image";
import { BookmarkX } from "lucide-react";
import BorrowButton from "./BorrowButton";

export default function WishlistPage({ items = [] }) {
  const [list, setList] = useState(items);
  const [removingId, setRemovingId] = useState(null);

  async function handleRemove(id_wishlist) {
    if (!id_wishlist || removingId) return;

    setRemovingId(id_wishlist);
    try {
      const res = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wishlist_id: id_wishlist }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Failed to remove wishlist item", res.status, data);
        return;
      }

      setList((prev) => prev.filter((item) => item.id_wishlist !== id_wishlist));
    } catch (err) {
      console.error("Remove wishlist request error", err);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-10">
      <h1 className="text-3xl font-bold">My Wishlist</h1>

      <div className="space-y-6">
        {list.length === 0 && (
          <p className="text-muted-foreground text-lg">
            Your wishlist is empty.
          </p>
        )}

        {list.map((book) => (
          <div
            key={book.id_wishlist}
            className="flex items-center gap-6 p-5 bg-card rounded-xl shadow hover:shadow-lg transition border border-border"
          >
            <div className="relative w-20 h-28 rounded-lg overflow-hidden bg-muted shadow">
              <Image
                src={`/img/book_img/${book.book_cover}`}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="font-semibold text-lg truncate">{book.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                {book.author}
              </p>
              <p className="text-xs text-muted-foreground">
                {book.original_year || "—"}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 min-w-[110px]">
              {book.stock > 0 ? (
                <span className="text-xs font-medium px-3 py-1 bg-green-500 text-white rounded-full">
                  Available
                </span>
              ) : (
                <span className="text-xs font-medium px-3 py-1 bg-gray-300 text-gray-700 rounded-full">
                  Out of Stock
                </span>
              )}

              {book.stock > 0 && (
                <BorrowButton bookId={book.id_book} stock={book.stock} />
              )}

              <button
                onClick={() => handleRemove(book.id_wishlist)}
                disabled={removingId === book.id_wishlist}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 disabled:opacity-60"
              >
                <BookmarkX size={16} />
                {removingId === book.id_wishlist ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
