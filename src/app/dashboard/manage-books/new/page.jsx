import BookForm from "@/components/admin/staff/books/BookForm";

async function fetchCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`,
      { cache: "no-store" }
    );

    if (!res.ok) return [];

    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("fetchCategories error:", err);
    return [];
  }
}

export default async function NewBookPage({ searchParams }) {
  const params = searchParams ? await searchParams : {};
  const returnQuery = (() => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);
    if (params.q) query.set("q", params.q);
    return query.toString();
  })();

  const categories = await fetchCategories();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Add Book</h1>
        <p className="text-muted-foreground">
          Tambahkan buku baru ke katalog perpustakaan.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <BookForm
          categories={categories}
          mode="create"
          returnQuery={returnQuery}
        />
      </div>
    </div>
  );
}
