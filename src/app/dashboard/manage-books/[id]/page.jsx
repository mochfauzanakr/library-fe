import BookForm from "@/components/admin/staff/books/BookForm";

async function fetchBook(id) {
  if (!id) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/books/${id}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("fetchBook error:", err);
    return null;
  }
}

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

export default async function EditBookPage(props) {
  const { id } = props?.params ? await props.params : {};
  const searchParams = props?.searchParams ? await props.searchParams : {};

  const returnQuery = (() => {
    const query = new URLSearchParams();
    if (searchParams.page) query.set("page", searchParams.page);
    if (searchParams.limit) query.set("limit", searchParams.limit);
    if (searchParams.q) query.set("q", searchParams.q);
    return query.toString();
  })();

  const [book, categories] = await Promise.all([
    fetchBook(id),
    fetchCategories(),
  ]);

  if (!book) {
    return (
      <div className="rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Buku tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Edit Book</h1>
        <p className="text-muted-foreground">
          Perbarui informasi buku yang sudah ada.
        </p>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <BookForm
          initialData={book}
          categories={categories}
          mode="edit"
          returnQuery={returnQuery}
        />
      </div>
    </div>
  );
}
