import FilterComponent from "@/components/frontend/Filter/FilterComponent";
import { getData } from "@/lib/getData";
import React from "react";

export default async function Search({ searchParams }) {
  const { sort = "asc", min = 0, max = "", page = 1, search = "" } = searchParams;

  const query = new URLSearchParams({
    search: search || "",
    page: page.toString(),
    sort,
    min: min.toString(),
    max: max.toString(),
  }).toString();

  let products = { data: [] };

  try {
    products = await getData(`products/search?${query}`);
  } catch (err) {
    console.error("Search fetch error:", err);
  }

  const category = {
    title: search,
    slug: "",
    isSearch: true,
    products: products?.data || [],
  };

  return (
    <div>
      <FilterComponent category={category} products={products?.data || []} />
    </div>
  );
}
