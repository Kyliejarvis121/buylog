"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroCarousel({ banners = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  if (!Array.isArray(banners) || banners.length === 0) return null;

  const next = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // AUTO SLIDE
  useEffect(() => {
    if (paused || banners.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [paused, banners.length]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-md"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* SLIDES */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {banners.map((banner, i) => (
          <Link
            key={i}
            href={banner.link || "#"}
            className="min-w-full"
          >
            <Image
              src={banner.imageUrl}
              width={1200}
              height={500}
              alt={banner.title || "Banner"}
              className="w-full object-cover"
              priority={i === 0}
            />
          </Link>
        ))}
      </div>

      {/* NAVIGATION */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* DOTS */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                i === index ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}