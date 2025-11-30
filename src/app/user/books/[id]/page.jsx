import Image from "next/image";

async function fetchBook(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const json = await res.json();
  return json.data;
}

export default async function BookDetailPage(props) {
  const { id } = await props.params;
  const book = await fetchBook(id);

  if (!book) {
    return <div className="p-6">Book not found.</div>;
  }

  return (
    <div className="w-full max-w-[950px] mx-auto space-y-10">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">{book.title}</h1>

      {/* TOP SECTION */}
      <div className="flex flex-col sm:flex-row gap-8">

        {/* LEFT COVER */}
        <div className="w-full sm:w-[300px]">
          <div className="relative w-full aspect-[3/4] rounded-md overflow-hidden bg-muted shadow">
            <Image
              src={`/img/book_img/${book.book_cover}`}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* RIGHT DETAIL */}
        <div className="flex-1 p-4 rounded-md bg-card shadow space-y-4">

          <Detail label="Author" value={book.author} />
          <Detail label="Category" value={book.category} />
          <Detail label="Publisher" value={book.publisher} />
          <Detail label="ISBN" value={book.isbn} />
          <Detail label="Language" value={book.language} />
          <Detail label="Year" value={book.original_year || "—"} />
          <Detail label="Pages" value={book.total_pages || "—"} />
          <Detail label="Stock" value={book.stock} />
          <Detail label="Rack Code" value={book.rack_code} />
          <Detail 
            label="Added At"
            value={new Date(book.created_at).toLocaleDateString()}
          />

          {/* BORROW BUTTON */}
          <button 
            className="mt-4 w-full py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition">
            Borrow Book
          </button>

        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
          {book.description}
        </p>
      </div>

    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
