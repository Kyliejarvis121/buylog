"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroCarousel({ banners = [] }) {
  if (!Array.isArray(banners) || banners.length === 0) return null;

  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // AUTO SLIDE
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000); // 4 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const banner = banners[index];

  return (
    <div className="relative w-full overflow-hidden rounded-md">
      <Link href={banner.link || "#"}>
        <Image
          src={banner.imageUrl}
          width={1200}
          height={500}
          alt={banner.title || "Banner"}
          className="w-full object-cover"
          priority
        />
      </Link>

      {/* Navigation Buttons */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full ${
                i === index ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}