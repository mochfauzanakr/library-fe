import BookCard from "@/components/user/category/BookCard";

async function fetchCategory(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${id}`,
    { cache: "no-store" }
  );
  return res.json();
}

async function fetchBooksByCategory(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/books?category_id=${id}`,
    {
      cache: "no-store",
    }
  );
  return res.json();
}

export default async function CategoryDetailPage({ params }) {
  const { id } = await params;

  const categoryRes = await fetchCategory(id);
  const booksRes = await fetchBooksByCategory(id);

  const category = categoryRes?.data;
  const books = booksRes?.data || [];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">

      <div>
        <h1 className="text-2xl font-semibold">{category?.name}</h1>
        <p className="text-neutral-500 text-sm mt-1">
          {books.length} books in this category
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id_book} book={book} />
        ))}
      </div>

    </div>
  );
}
