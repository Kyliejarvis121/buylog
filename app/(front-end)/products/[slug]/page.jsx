import dynamic from "next/dynamic";
import { getData } from "@/lib/getData";

// Dynamic import (client-only)
const ProductImageCarousel = dynamic(
  () => import("@/components/frontend/ProductImageCarousel"),
  { ssr: false }
);

export default async function ProductDetailPage({ params: { slug } }) {
  // Fetch the product (ensure API includes category and farmer)
  const productRes = await getData(`products/product/${slug}`);
  const product = productRes?.success ? productRes.data : null;

  if (!product) return <div className="text-red-600 p-4">Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProductImageCarousel
        productImages={product.productImages ?? []}
        thumbnail={product.imageUrl ?? null}
      />

      <h1 className="text-3xl font-bold mt-6">{product.title}</h1>

      {/* CATEGORY */}
      <p className="text-gray-600 mt-2">
        Category: {product.category?.title || "Uncategorized"}
      </p>

      {/* SELLER PHONE */}
      <p className="text-gray-800 mt-1">
        Seller Phone: {product.farmer?.phoneNumber || "Not provided"}
      </p>

      <p className="text-2xl font-semibold text-green-600 mt-4">
        ₦{Number(product.price).toLocaleString()}
      </p>

      <p className="text-gray-700 mt-4 whitespace-pre-line">
        {product.description || "No description available."}
      </p>
    </div>
  );
}
