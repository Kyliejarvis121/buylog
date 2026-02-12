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

  const sellerPhone = product.phoneNumber || "Not provided"; // seller phone

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Product Images */}
      <ProductImageCarousel
        productImages={product.productImages ?? []}
        thumbnail={product.imageUrl ?? null}
      />

      {/* Product Title */}
      <h1 className="text-3xl font-bold mt-6">{product.title}</h1>

      {/* CATEGORY */}
      <p className="text-gray-600 mt-2">
        Category: {product.category?.title || "Uncategorized"}
      </p>

      {/* LOCATION (clickable, opens Google Maps) */}
      {product.location ? (
        <p className="text-gray-600 mt-1">
          📍 Location:{" "}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              product.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline hover:text-blue-800"
          >
            {product.location}
          </a>
        </p>
      ) : (
        <p className="text-gray-400 mt-1">📍 Location: Not provided</p>
      )}

      {/* SELLER PHONE */}
      {sellerPhone !== "Not provided" ? (
        <p className="text-blue-600 mt-1">
          Seller Phone:{" "}
          <a href={`tel:${sellerPhone}`} className="underline hover:text-blue-800">
            {sellerPhone}
          </a>
        </p>
      ) : (
        <p className="text-gray-800 mt-1">Seller Phone: Not provided</p>
      )}

      {/* PRICE */}
      <p className="text-2xl font-semibold text-green-600 mt-4">
        ₦{Number(product.price).toLocaleString()}
      </p>

      {/* DESCRIPTION */}
      <p className="text-gray-700 mt-4 whitespace-pre-line">
        {product.description || "No description available."}
      </p>
    </div>
  );
}
