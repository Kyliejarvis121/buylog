"use client"


import { getData } from "@/lib/getData";
import dynamic from "next/dynamic";

// 1️⃣ Import Swiper component dynamically (client-side only)
const ProductImagesSwiper = dynamic(
  () => import("@/components/frontend/ProductImagesSwiper"),
  { ssr: false } // important!
);

export default async function ProductDetailPage({ params: { slug } }) {
  // -------------------------------
  // Fetch product
  // -------------------------------
  const productRes = await getData(`products/product/${slug}`);
  const product = productRes?.success && productRes.data ? productRes.data : null;

  if (!product) {
    return (
      <div className="p-4 text-center text-red-600 text-lg">
        ❌ Product not found
      </div>
    );
  }

  // -------------------------------
  // Fetch category
  // -------------------------------
  let category = null;
  if (product?.categoryId) {
    const categoryRes = await getData(`categories/${product.categoryId}`);
    category = categoryRes?.success && categoryRes.data ? categoryRes.data : null;
  }

  // -------------------------------
  // Prepare images array
  // -------------------------------
  const images =
    product.productImages?.length > 0
      ? product.productImages
      : product.imageUrl
      ? [product.imageUrl]
      : ["/no-image.png"];

  // -------------------------------
  // Render page
  // -------------------------------
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Product Images */}
      <ProductImagesSwiper images={images} title={product.title} />

      {/* Product Info */}
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      <p className="text-gray-600 mb-3">
        Category:{" "}
        <span className="font-semibold">
          {category ? category.name : "Uncategorized"}
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
