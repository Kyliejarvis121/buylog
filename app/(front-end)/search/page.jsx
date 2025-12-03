import FilterComponent from "@/components/frontend/Filter/FilterComponent";
import { getData } from "@/lib/getData";
import React from "react";

export default async function Search({ searchParams }) {
  const { sort = "asc", min = 0, max = "", page = 1, search = "" } = searchParams;

  // Fetch filtered products
  const products = await getData(
    `products/search?search=${search}&page=${page}&sort=${sort}&min=${min}&max=${max}`
  );

  const category = {
    title: search,
    slug: "",
    isSearch: true,
    products,
  };

  return (
    <div>
      <FilterComponent category={category} products={products} />
    </div>
  );
}
