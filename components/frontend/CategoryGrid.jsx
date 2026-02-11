"use client";

import Link from "next/link";
import Image from "next/image";

export default function CategoryGrid({ categories = [] }) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-3 px-3 py-4">
      {categories.map((cat) => {
        const label = cat.name || cat.title; // supports both
        const imageUrl = cat.imageUrl;       // uploaded image from admin

        return (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`} // ensure this route filters products by category
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border hover:shadow-sm transition bg-white"
          >
            {imageUrl ? (
              <div className="w-10 h-10 relative">
                <Image
                  src={imageUrl}
                  alt={label}
                  fill
                  className="object-contain rounded"
                />
              </div>
            ) : (
              <div className="w-10 h-10 flex items-center justify-center text-lg bg-gray-200 rounded">
                📦
              </div>
            )}

            <span className="text-[11px] font-medium text-center leading-tight text-gray-800">
              {label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
