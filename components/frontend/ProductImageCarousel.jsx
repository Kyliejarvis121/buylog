"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function ProductImageCarousel({
  productImages = [],
  thumbnail,
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const images =
    productImages.length > 0
      ? productImages
      : thumbnail
      ? [thumbnail]
      : ["/no-image.png"];

  return (
    <div className="w-full">
      {/* MAIN IMAGE */}
      <Swiper
        spaceBetween={10}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="w-full h-[280px] sm:h-[350px] md:h-[420px] rounded-lg overflow-hidden"
      >
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`Product image ${i + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={i === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          freeMode
          watchSlidesProgress
          modules={[FreeMode, Thumbs]}
          className="mt-3 h-[70px]"
        >
          {images.map((image, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full h-[70px] border rounded cursor-pointer overflow-hidden">
                <Image
                  src={image}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
