"use client"; // Client component only

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductImagesSwiper({ images, title }) {
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full mb-6">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
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
