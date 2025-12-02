await db.query(
  "UPDATE borrowings SET status='return', actual_return=? WHERE id_borrows=?",
  [mysqlNow, borrow_id]
);

// tambah stok
await db.query(
  "UPDATE books SET stock = stock + 1 WHERE id_book = ?",
  [bookId]
);
