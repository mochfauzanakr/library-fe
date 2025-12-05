"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function BookForm({
  initialData,
  categories = [],
  mode = "create",
  returnQuery = "",
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    isbn: initialData?.isbn || "",
    book_cover: initialData?.book_cover || "",
    title: initialData?.title || "",
    author: initialData?.author || "",
    publisher: initialData?.publisher || "",
    category_id: initialData?.category_id ?? "",
    description: initialData?.description || "",
    language: initialData?.language || "",
    original_year: initialData?.original_year ?? "",
    total_pages: initialData?.total_pages ?? "",
    stock: initialData?.stock ?? "",
    rack_id: initialData?.rack_id ?? "",
  });

  const handleChange = (field) => (event) => {
    const value = event?.target?.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toNumberOrNull = (value, { defaultValue = null } = {}) => {
    if (value === "" || value === undefined || value === null) {
      return defaultValue;
    }
    const num = Number(value);
    return Number.isNaN(num) ? NaN : num;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim() || !form.author.trim()) {
      setError("Title and author are required.");
      return;
    }

    const parsedCategoryId = toNumberOrNull(form.category_id);
    const parsedYear = toNumberOrNull(form.original_year);
    const parsedPages = toNumberOrNull(form.total_pages);
    const parsedRack = toNumberOrNull(form.rack_id);
    const parsedStock = toNumberOrNull(form.stock, { defaultValue: 0 });

    if (
      [parsedCategoryId, parsedYear, parsedPages, parsedRack, parsedStock].some(
        (value) => Number.isNaN(value)
      )
    ) {
      setError("Please enter valid numbers for numeric fields.");
      return;
    }

    const payload = {
      isbn: form.isbn || null,
      book_cover: form.book_cover || null,
      title: form.title.trim(),
      author: form.author.trim(),
      publisher: form.publisher || null,
      category_id: parsedCategoryId,
      description: form.description || null,
      language: form.language || null,
      original_year: parsedYear,
      year: parsedYear,
      total_pages: parsedPages,
      stock: parsedStock,
      rack_id: parsedRack,
    };

    const endpoint =
      mode === "edit"
        ? `/api/admin/books/${initialData?.id_book}`
        : "/api/admin/books";
    const method = mode === "edit" ? "PUT" : "POST";

    setSubmitting(true);
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Failed to save book.");
        return;
      }

      const backTo = returnQuery
        ? `/dashboard/manage-books?${returnQuery}`
        : "/dashboard/manage-books";
      router.push(backTo);
      router.refresh();
    } catch (err) {
      console.error("Book form submit error:", err);
      setError("Unexpected error while saving the book.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title *</label>
          <Input
            placeholder="Book title"
            value={form.title}
            onChange={handleChange("title")}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Author *</label>
          <Input
            placeholder="Author name"
            value={form.author}
            onChange={handleChange("author")}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Publisher</label>
          <Input
            placeholder="Publisher"
            value={form.publisher}
            onChange={handleChange("publisher")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">ISBN</label>
          <Input
            placeholder="ISBN"
            value={form.isbn}
            onChange={handleChange("isbn")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <Input
            placeholder="Language"
            value={form.language}
            onChange={handleChange("language")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Book Cover (filename)</label>
          <Input
            placeholder="cover.jpg"
            value={form.book_cover}
            onChange={handleChange("book_cover")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Original Year</label>
          <Input
            type="number"
            placeholder="e.g. 2020"
            value={form.original_year}
            onChange={handleChange("original_year")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Total Pages</label>
          <Input
            type="number"
            placeholder="e.g. 320"
            value={form.total_pages}
            onChange={handleChange("total_pages")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Stock</label>
          <Input
            type="number"
            placeholder="0"
            value={form.stock}
            onChange={handleChange("stock")}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Rack ID</label>
          <Input
            type="number"
            placeholder="Rack ID"
            value={form.rack_id}
            onChange={handleChange("rack_id")}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <select
            className="h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            value={form.category_id ?? ""}
            onChange={handleChange("category_id")}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id_category} value={cat.id_category}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
          placeholder="Book description"
          value={form.description}
          onChange={handleChange("description")}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const backTo = returnQuery
              ? `/dashboard/manage-books?${returnQuery}`
              : "/dashboard/manage-books";
            router.push(backTo);
          }}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Create Book"}
        </Button>
      </div>
    </form>
  );
}
