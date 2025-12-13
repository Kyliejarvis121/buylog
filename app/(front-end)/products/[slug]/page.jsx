"use client"; // Swiper is client-side only

import { getData } from "@/lib/getData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default async function ProductDetailPage({ params: { slug } }) {
  // -------------------------------
  // 1. Fetch Product
  // -------------------------------
  const productRes = await getData(`products/product/${slug}`);
  const product =
    productRes && productRes.success && productRes.data
      ? productRes.data
      : null;

  // -------------------------------
  // 2. Fetch Category
  // -------------------------------
  let category = null;
  if (product?.categoryId) {
    const categoryRes = await getData(`categories/${product.categoryId}`);
    category =
      categoryRes && categoryRes.success && categoryRes.data
        ? categoryRes.data
        : null;
  }

  // -------------------------------
  // 3. Handle Not Found
  // -------------------------------
  if (!product) {
    return (
      <div className="p-4 text-center text-red-600 text-lg">
        ❌ Product not found
      </div>
    );
  }

  // -------------------------------
  // 4. Prepare Images Array
  // -------------------------------
  const images = product.images?.length
    ? product.images
    : [{ url: product.imageUrl || product.image || "/no-image.png" }];

  // -------------------------------
  // 5. Render Page
  // -------------------------------
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* PRODUCT IMAGES SWIPER */}
      <div className="w-full mb-6">
        <Swiper
          navigation // ✅ enables arrows
          pagination={{ clickable: true }} // ✅ enables dots
          spaceBetween={10}
          slidesPerView={1}
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img.url}
                alt={`${product.title} image ${index + 1}`}
                className="w-full h-80 object-cover rounded-lg border bg-gray-100"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      {/* CATEGORY */}
      <p className="text-gray-600 mb-3">
        Category:{" "}
        <span className="font-semibold">
          {category ? category.name : "Uncategorized"}
        </span>
      </p>

      {/* PRICE */}
      <p className="text-2xl font-semibold text-green-600 mb-5">
        ₦{Number(product.price)?.toLocaleString() ?? "0"}
      </p>

      {/* DESCRIPTION */}
      <div className="text-gray-700 leading-7 whitespace-pre-line">
        {product.description || "No description available."}
      </div>
    </div>
  );
}
