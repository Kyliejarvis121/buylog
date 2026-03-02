import FilterComponent from "@/components/frontend/Filter/FilterComponent";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({ params: { slug }, searchParams }) {
  const { sort = "asc", min = 0, max = "", page = 1 } = searchParams;

  const categoryRes = await getData(`categories/filter/${slug}`);
  const category = categoryRes.success ? categoryRes.data : null;

  if (!category || !category.id) {
    return <div className="p-4 text-red-600">Category not found</div>;
  }

  const productsRes = await getData(
    `products?categoryId=${category.id}&page=${page}&sort=${sort}&min=${min}&max=${max}`
  );

  const products = productsRes.success ? productsRes.data : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6">
      
      {/* Category Title */}
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {category.title}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">

        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside className="hidden md:block md:w-1/4">
          <FilterComponent
            category={category}
            variant="sidebar"
          />
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="w-full md:w-3/4">

          {/* ===== SORT + MOBILE FILTER (Mobile Only) ===== */}
          <div className="md:hidden space-y-3 mb-4">
            
            {/* Sort By */}
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sort By</span>
              <FilterComponent
                category={category}
                variant="sort"
              />
            </div>

            {/* Mobile Filters (Under Sort) */}
            <FilterComponent
              category={category}
              variant="mobile"
            />
          </div>

          {/* ===== DESKTOP SORT ===== */}
          <div className="hidden md:flex justify-end mb-4">
            <FilterComponent
              category={category}
              variant="sort"
            />
          </div>

          {/* ===== PRODUCT GRID (ONLY ONCE) ===== */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id}>
                {/* Your product card component here */}
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
}