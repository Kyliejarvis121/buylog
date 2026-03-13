import FilterComponent from "@/components/frontend/Filter/FilterComponent";
import { getData } from "@/lib/getData";
import React from "react";

export default async function Page({ params, searchParams }) {
  const { slug } = params;

  // Normalize query params
  const sort = searchParams?.sort || "asc";
  const page = parseInt(searchParams?.page) || 1;
  const min = parseInt(searchParams?.min) || 0;
  const max = searchParams?.max ? parseInt(searchParams.max) : "";

  // Fetch category by slug
  const categoryRes = await getData(`categories/filter/${slug}`);

  if (!categoryRes?.success || !categoryRes?.data) {
    return (
      <div className="p-4 text-red-600">
        Category not found
      </div>
    );
  }

  const category = categoryRes.data;

  if (!category?.id) {
    return (
      <div className="p-4 text-red-600">
        Invalid category data
      </div>
    );
  }

  // Fetch products with filters
  const productsRes = await getData(
    `products?categoryId=${category.id}&page=${page}&sort=${sort}&min=${min}&max=${max}`
  );

  const products =
    productsRes?.success && Array.isArray(productsRes.data)
      ? productsRes.data
      : [];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6">

      {/* Filter component (handles mobile & desktop) */}
      <FilterComponent category={category} products={products} />

    </div>
  );
}