"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function DeleteBookConfirm({ open, setOpen, book }) {
  const router = useRouter();

  async function remove() {
    // Guard against calling DELETE without a valid book id
    if (!book?.id_book) return;

    const res = await fetch(`/api/admin/books/${book.id_book}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  if (!book) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Book</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete <b>{book.title}</b> by{" "}
          <b>{book.author}</b>?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={remove}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function BookTable({ books, meta, queryString = "" }) {
  const router = useRouter();
  const [selectedBook, setSelectedBook] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  // Defensive: drop any null/undefined book rows to avoid runtime errors in the table
  const safeBooks = Array.isArray(books)
    ? books.filter((book) => book && book.id_book)
    : [];

  const appendQuery = useMemo(() => {
    const qs = queryString ? queryString : "";
    return (path) => (qs ? `${path}?${qs}` : path);
  }, [queryString]);

  return (
    <div className="space-y-4">
      {/* Add Book */}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            router.push(appendQuery("/dashboard/manage-books/new"));
          }}
        >
          Add Book
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Author</th>
              <th className="p-2 text-left">Category</th>
              <th className="p-2 text-left">Stock</th>
              <th className="p-2 text-left">Rack</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {safeBooks.length > 0 ? (
              safeBooks.map((book) => (
                <tr key={book.id_book} className="border-t">
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.category}</td>
                  <td className="p-2">{book.stock}</td>
                  <td className="p-2">{book.rack_code}</td>
                  <td className="p-2 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          appendQuery(`/dashboard/manage-books/${book.id_book}`)
                        )
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedBook(book);
                        setOpenDelete(true);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                  No books found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 text-sm">
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={meta.page <= 1}
            onClick={() => {
              router.push(`?page=${meta.page - 1}`);
            }}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={meta.page >= meta.totalPages}
            onClick={() => {
              router.push(`?page=${meta.page + 1}`);
            }}
          >
            Next
          </Button>
        </div>
      )}

      <DeleteBookConfirm
        open={openDelete}
        setOpen={setOpenDelete}
        book={selectedBook}
      />
    </div>
  );
}
