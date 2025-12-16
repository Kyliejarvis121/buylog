import React from "react";
import Product from "../Product";
import Paginate from "./Paginate";

export default function FilteredProducts({ products, productCount, isSearch }) {
  // PAGINATION
  const pageSize = 3;
  const totalPages = Math.ceil(productCount / pageSize);

  return (
    <div className="w-full">
      {/* Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product, i) => (
          <Product key={i} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="p-8 mx-auto flex items-center justify-center w-full">
        <Paginate totalPages={totalPages} isSearch={isSearch} />
      </div>
    </div>
  );
}
