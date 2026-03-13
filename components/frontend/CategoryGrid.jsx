"use client";

import Link from "next/link";
import Image from "next/image";

export default function CategoryGrid({ categories = [] }) {
  return (
    <div className="max-w-7xl mx-auto px-3 py-4">
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {categories.map((cat) => {
          const label = cat.name || cat.title;
          const imageUrl = cat.imageUrl;

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg border hover:shadow-sm transition bg-white"
            >
              {/* Jiji-style small image */}
              {imageUrl ? (
                <div className="w-14 h-14 relative">
                  <Image
                    src={imageUrl}
                    alt={label}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 flex items-center justify-center text-lg bg-gray-200 rounded-md">
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
    </div>
  );
}