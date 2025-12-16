import FilterComponent from "@/components/frontend/Filter/FilterComponent";
import { getData } from "@/lib/getData";
import React from "react";

export default async function page({ params: { slug }, searchParams }) {
  const { sort = "asc", min = 0, max = "", page = 1 } = searchParams;

  // Fetch category
  const categoryRes = await getData(`categories/filter/${slug}`);
  const category = categoryRes.success ? categoryRes.data : null;

  if (!category || !category.id) {
    return <div className="p-4 text-red-600">Category not found</div>;
  }

  // Fetch products
  const productsRes = await getData(
    `products?catId=${category.id}&page=${page}&sort=${sort}&min=${min}&max=${max}`
  );
  const products = productsRes.success ? productsRes.data : [];

  return (
    <div className="w-full overflow-x-hidden max-w-6xl mx-auto px-4 md:px-8">
      {/* Flex container: sidebar hidden on mobile */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar / Filters */}
        <div className="hidden md:block md:w-1/4">
          <FilterComponent category={category} products={products} />
        </div>

        {/* Product Grid / Main Content */}
        <div className="w-full md:w-3/4">
          {/* Reuse your existing FilterComponent here */}
          <FilterComponent category={category} products={products} />
        </div>
      </div>
    </div>
  );
}
