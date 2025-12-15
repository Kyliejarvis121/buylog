"use client"; // required for Swiper (client-side only)

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";

export default function ProductImagesSwiper({ images, title }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <Swiper
        navigation
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
        modules={[Navigation, Pagination]}
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <img
              src={typeof img === "string" ? img : img.url}
              alt={`${title} image ${index + 1}`}
              className="w-full h-80 object-cover rounded-lg border bg-gray-100"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
