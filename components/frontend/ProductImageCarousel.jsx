"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function ProductImageCarousel({ productImages = [], thumbnail }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const images = productImages.length > 0
    ? productImages
    : thumbnail
    ? [thumbnail]
    : ["/no-image.png"];

  return (
    <div className="col-span-3">
      <Swiper
        style={{
          "--swiper-navigation-color": "#fff",
          "--swiper-pagination-color": "#fff",
        }}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <img src={image} alt={`Product image ${i + 1}`} className="w-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {images.map((image, i) => (
          <SwiperSlide key={i}>
            <img src={image} alt={`Thumbnail ${i + 1}`} className="w-full object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
