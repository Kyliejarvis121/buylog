"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "nuka-carousel";

export default function HeroCarousel({ banners = [] }) {
  if (!Array.isArray(banners) || banners.length === 0) return null;

  const config = {
    nextButtonClassName: "rounded-full",
    nextButtonText: <ChevronRight />,
    pagingDotsClassName: "me-2 w-4 h-4",
    prevButtonClassName: "rounded-full",
    prevButtonText: <ChevronLeft />,
  };

  return (
    <Carousel
      defaultControlsConfig={config}
      autoplay
      wrapAround
      className="rounded-md overflow-hidden"
    >
      {banners.map((banner, i) => (
        <Link key={i} href={banner.link || "#"} passHref>
          <Image
            src={banner.imageUrl}
            width={712}
            height={384}
            alt={banner.title || "Banner"}
            className="w-full object-cover"
          />
        </Link>
      ))}
    </Carousel>
  );
}
