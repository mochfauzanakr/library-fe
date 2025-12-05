export const BOOK_FIELDS = `
  b.id_book,
  b.isbn,
  b.book_cover,
  b.title,
  b.author,
  b.publisher,
  b.category_id,
  c.name AS category,
  b.description,
  b.language,
  b.original_year,
  b.total_pages,
  b.stock,
  b.rack_id,
  r.rack_code AS rack_code,
  b.created_at
`;
