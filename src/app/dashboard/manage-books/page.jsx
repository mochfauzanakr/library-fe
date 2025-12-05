import BookTable from "@/components/admin/staff/books/BookTable";

// Fetch books from the admin endpoint with pagination + optional search.
async function fetchBooks({ page = 1, limit = 20, search = "" } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (search) params.set("q", search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) return { data: [], meta: null };

  const json = await res.json();
  return json;
}

export default async function BooksPage({ searchParams } = {}) {
  // In Next 16 app router, searchParams arrives as a Promise; await before reading.
  const params = searchParams ? await searchParams : {};

  // Derive pagination + search from query (fallbacks keep page usable without params).
  const page = Number(params?.page) || 1;
  const limit = Number(params?.limit) || 20;
  const search = params?.q || "";

  const query = new URLSearchParams();
  if (page) query.set("page", String(page));
  if (limit) query.set("limit", String(limit));
  if (search) query.set("q", search);
  const queryString = query.toString();

  const { data, meta } = await fetchBooks({ page, limit, search });
  // Only keep valid book objects (defensive against null/undefined rows).
  const safeData = Array.isArray(data)
    ? data.filter((book) => book && book.id_book)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Books</h1>
          <p className="text-muted-foreground">
            Admin & staff can create, edit, and delete books here.
          </p>
        </div>
      </div>

      <BookTable
        books={safeData}
        meta={meta || undefined}
        queryString={queryString}
      />
    </div>
  );
}
