"use client";

import Link from "next/link";

export default function CategoryGrid({ categories = [] }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3 px-3 py-4">
      {categories.map((cat) => {
        const label = cat.name || cat.title; // supports both

        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border hover:shadow-sm transition bg-white"
          >
            {/* Show uploaded image if exists, else fallback */}
            {cat.imageUrl ? (
              <img
                src={cat.imageUrl}
                alt={label}
                className="w-10 h-10 object-contain rounded"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center text-lg bg-gray-200 rounded">
                📦
              </div>
            )}

            <span className="text-[11px] font-medium text-center leading-tight">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
