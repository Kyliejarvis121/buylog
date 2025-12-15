"use client";

import { useEffect, useState } from "react";
import { getData } from "@/lib/getData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";

export default function ProductDetailPage({ params: { slug } }) {
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productRes = await getData(`products/product/${slug}`);
        if (!productRes?.success || !productRes?.data) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(productRes.data);

        // Fetch category if exists
        if (productRes.data.categoryId) {
          const categoryRes = await getData(
            `categories/${productRes.data.categoryId}`
          );
          setCategory(categoryRes?.success ? categoryRes.data : null);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product)
    return (
      <div className="p-4 text-center text-red-600 text-lg">
        ❌ Product not found
      </div>
    );

  // Prepare images
  const images =
    product.productImages?.length > 0
      ? product.productImages.map((img) => (typeof img === "string" ? img : img.url))
      : product.imageUrl
      ? [product.imageUrl]
      : ["/no-image.png"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Swiper */}
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
                src={img}
                alt={`${product.title} image ${index + 1}`}
                className="w-full h-80 object-cover rounded-lg border bg-gray-100"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Product Info */}
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <p className="text-gray-600 mb-3">
        Category:{" "}
        <span className="font-semibold">
          {category ? category.title || category.name : "Uncategorized"}
        </span>
      </p>
      <p className="text-2xl font-semibold text-green-600 mb-5">
        ₦{Number(product.price)?.toLocaleString() ?? "0"}
      </p>
      <div className="text-gray-700 leading-7 whitespace-pre-line">
        {product.description || "No description available."}
      </div>
    </div>
  );
}
