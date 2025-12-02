"use client";

import Link from "next/link";

export default function CategoryCard({ cat }) {
  return (
    <Link
      href={`/user/categories/${cat.id_category}`}
      className="block border border-neutral-200 rounded-md p-4 hover:bg-neutral-50 transition"
    >
      <p className="font-medium text-sm">{cat.name}</p>
      {cat.description && (
        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
          {cat.description}
        </p>
      )}
    </Link>
  );
}
