import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import Sorting from "./Sorting";
import Filters from "./Filters";
import FilteredProducts from "./FilteredProducts";

export default function FilterComponent({ category, products }) {
  const { title, slug } = category;
  const productCount = category.products?.length || 0;

  return (
    <div className="w-full overflow-x-hidden">

      {/* Breadcrumb & Sorting */}
      <div className="bg-white dark:bg-slate-900 space-y-6 text-slate-900 dark:text-slate-100 py-6 px-4">
        <Breadcrumb title={title} resultCount={productCount} />

        <Sorting isSearch={category?.isSearch} title={title} slug={slug} />
      </div>

      {/* Main Grid */}
      <div className="flex flex-col md:flex-row gap-6 py-6 px-4">

        {/* Sidebar Filter (Desktop) */}
        <aside className="hidden md:block md:w-1/3">
          <Filters slug={slug} isSearch={category?.isSearch} />
        </aside>

        {/* Products Area */}
        <main className="w-full md:w-2/3">
          <FilteredProducts
            isSearch={category?.isSearch}
            productCount={productCount}
            products={products}
          />
        </main>

      </div>
    </div>
  );
}