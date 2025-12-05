async function fetchCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = await res.json().catch(() => ({}));
  return Array.isArray(json.data) ? json.data : [];
}

export default async function DashboardCategoriesPage() {
  const categories = await fetchCategories();
  const total = categories.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories (view only)</h1>
          <p className="text-muted-foreground">
            Daftar kategori koleksi
          </p>
        </div>
        <span className="text-sm text-muted-foreground">Total: {total}</span>
      </div>

      <div className="border rounded-lg bg-white shadow-sm divide-y">
        {categories.length ? (
          categories.map((cat) => (
            <div key={cat.id_category} className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{cat.name}</h3>
                <span className="text-xs text-muted-foreground">ID: {cat.id_category}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {cat.description || "No description"}
              </p>
            </div>
          ))
        ) : (
          <p className="p-4 text-sm text-muted-foreground">No categories available.</p>
        )}
      </div>
    </div>
  );
}
