import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import Breadcrumb from "./Breadcrumb";
import Sorting from "./Sorting";
import Filters from "./Filters";
import FilteredProducts from "./FilteredProducts";

export default function FilterComponent({ category, products }) {
  const { title, slug } = category;
  const productCount = category.products.length;

  return (
    <div className="w-full overflow-x-hidden">
      {/* Breadcrumb & Sorting */}
      <div className="bg-white space-y-6 text-slate-900 py-8 px-4">
        <Breadcrumb title={title} resultCount={productCount} />
        <Sorting isSearch={category?.isSearch} title={title} slug={slug} />
      </div>

      {/* Main Grid */}
      <div className="flex flex-col md:flex-row gap-6 py-8 px-4">
        {/* Sidebar: hidden on mobile */}
        <div className="hidden md:block md:w-1/4">
          <Filters slug={slug} isSearch={category?.isSearch} />
        </div>

        {/* Products Grid: full width on mobile */}
        <div className="w-full md:w-3/4">
          <FilteredProducts
            isSearch={category?.isSearch}
            productCount={productCount}
            products={products}
          />
        </div>
      </div>
    </div>
  );
}
