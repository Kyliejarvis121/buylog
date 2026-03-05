import React from "react";
import Product from "../Product";
import Paginate from "./Paginate";

export default function FilteredProducts({ products, productCount, isSearch }) {
  const pageSize = 3;
  const totalPages = Math.ceil(productCount / pageSize);

  return (
    <div className="w-full">

      {/* Grid Container (Centered + Professional Spacing) */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <Product key={i} product={product} />
          ))}
        </div>
      </div>

      {/* Pagination (Centered) */}
      <div className="mt-10 flex justify-center">
        <Paginate totalPages={totalPages} isSearch={isSearch} />
      </div>

    </div>
  );
}