import PriceFilter from "./PriceFilter";
import BrandFilter from "./BrandFilter";

export default function Filters({ slug, isSearch }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-6">

      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Filters
      </h2>

      {/* Price Filter */}
      <div className="mb-4">
        <PriceFilter slug={slug} isSearch={isSearch} />
      </div>

      {/* Brand Filter (future use) */}
      {/* <BrandFilter /> */}

    </div>
  );
}
