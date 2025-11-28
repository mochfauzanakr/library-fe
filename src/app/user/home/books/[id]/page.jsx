import Image from "next/image";
import { notFound } from "next/navigation";

export default async function BookDetailPage({ params }) {
  const { id } = params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/books/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const json = await res.json();
  const book = json.data;
  const related = json.related_books;

  return (
    <div className="space-y-8">

      {/* MAIN BOOK INFO */}
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={`/img/book_img/${book.book_cover}`}
          alt={book.title}
          width={350}
          height={500}
          className="rounded-md object-cover"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="text-lg text-muted-foreground">{book.author}</p>

          <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
            <p><strong>Category:</strong> {book.category}</p>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>Language:</strong> {book.language}</p>
            <p><strong>Year:</strong> {book.original_year}</p>
            <p><strong>Pages:</strong> {book.total_pages}</p>
            <p><strong>Rack:</strong> {book.rack_code}</p>
          </div>

          <p className="mt-4 leading-6 text-muted-foreground text-sm">
            {book.description}
          </p>

          <button className="mt-6 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/80 transition">
            Borrow This Book
          </button>
        </div>
      </div>


      {/* RELATED BOOKS */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Related Books</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {related.map((b) => (
            <a
              key={b.id_book}
              href={`/books/${b.id_book}`}
              className="block hover:bg-accent rounded-md p-2 transition"
            >
              <Image
                src={`/img/book_img/${b.book_cover}`}
                width={200}
                height={300}
                className="w-full h-40 object-cover rounded"
                alt={b.title}
              />

              <p className="font-semibold text-sm mt-2 truncate">{b.title}</p>
              <p className="text-xs text-muted-foreground truncate">{b.author}</p>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
}
