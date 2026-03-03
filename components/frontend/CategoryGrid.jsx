"use client";

import Link from "next/link";
import Image from "next/image";

export default function CategoryGrid({ categories = [] }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((cat) => {
          const label = cat.name || cat.title;
          const imageUrl = cat.imageUrl;

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300"
            >
              {/* BIG Image Container */}
              <div className="relative w-full h-40 md:h-56">
                <Image
                  src={imageUrl || "/placeholder.jpg"}
                  alt={label}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"></div>
              </div>

              {/* Category Name Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-base md:text-lg font-semibold text-center px-2">
                  {label}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}