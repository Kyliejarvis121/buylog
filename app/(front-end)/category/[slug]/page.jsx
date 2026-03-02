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

  // ✅ FIX: Ensure products is always an array
  const products = Array.isArray(productsRes?.data)
    ? productsRes.data
    : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6">
      {/* Category Title */}
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {category.title}
      </h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:w-1/4">
          <FilterComponent
            category={category}
            products={products}
            variant="sidebar"
          />
        </aside>

        {/* Main Content */}
        <main className="w-full md:w-3/4">

          {/* Mobile Filter Bar */}
          <div className="md:hidden mb-4">
            <FilterComponent
              category={category}
              products={products}
              variant="mobile"
            />
          </div>

          {/* Product Grid */}
          <FilterComponent
            category={category}
            products={products}
            variant="grid"
          />
        </main>
      </div>
    </div>
  );
}