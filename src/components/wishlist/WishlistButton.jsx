"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";

export default function WishlistButton({ bookId, userId }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleAdd() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book_id: bookId,
          user_id: userId,
        }),
      });

      if (res.ok) {
        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition z-10"
    >
      {saved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
    </button>
  );
}
