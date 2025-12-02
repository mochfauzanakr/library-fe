import CategoryCard from "@/components/user/category/CategoryCard";

async function fetchCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`, {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data || [];
}

export default async function CategoriesPage() {
  const categories = await fetchCategories();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <h1 className="text-2xl font-semibold">Categories</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.id_category} cat={cat} />
        ))}
      </div>
    </div>
  );
}
