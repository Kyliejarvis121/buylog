// Remove "use client"
import { getData } from "@/lib/getData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";

export default async function ProductDetailPage({ params: { slug } }) {
  // Fetch product
  const productRes = await getData(`products/product/${slug}`);
  const product = productRes?.success ? productRes.data : null;

  if (!product) {
    return <div className="p-4 text-red-600 text-center">Product not found</div>;
  }

  // Fetch category
  let category = null;
  if (product.categoryId) {
    const categoryRes = await getData(`categories/${product.categoryId}`);
    category = categoryRes?.success ? categoryRes.data : null;
  }

  const images =
    product.productImages?.length > 0
      ? product.productImages.map((img) => (typeof img === "string" ? img : img.url))
      : product.imageUrl
      ? [product.imageUrl]
      : ["/no-image.png"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <img
              src={img}
              alt={`${product.title} image ${i + 1}`}
              className="w-full h-80 object-cover rounded-lg border bg-gray-100"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
      <p className="text-gray-600 mb-3">
        Category: <span className="font-semibold">{category?.title || category?.name || "Uncategorized"}</span>
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
