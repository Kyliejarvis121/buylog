import dynamic from "next/dynamic";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateLastSeen } from "@/lib/updateLastSeen";

const ProductImageCarousel = dynamic(
  () => import("@/components/frontend/ProductImageCarousel"),
  { ssr: false }
);

const ProductChatSection = dynamic(
  () => import("@/components/frontend/chat/ProductChatSection"),
  { ssr: false }
);

export default async function ProductDetailPage({ params }) {
  const { slug } = params;

  const productRes = await getData(`products/product/${slug}`);
  const product = productRes?.success ? productRes.data : null;

  if (!product) return <div className="text-red-600 p-4">Product not found</div>;

  // ✅ Correct App Router session call
  const session = await getServerSession(authOptions);
  const currentUser = session?.user;

  if (currentUser?.id) {
    await updateLastSeen(currentUser.id);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProductImageCarousel
        productImages={product.productImages ?? []}
        thumbnail={product.imageUrl ?? null}
      />

      <h1 className="text-3xl font-bold mt-6">{product.title}</h1>

      <p className="text-gray-600 mt-2">
        Category: {product.category?.title || "Uncategorized"}
      </p>

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

      {product.phoneNumber ? (
        <p className="text-blue-600 mt-1">
          Seller Phone:{" "}
          <a
            href={`tel:${product.phoneNumber}`}
            className="underline hover:text-blue-800"
          >
            {product.phoneNumber}
          </a>
        </p>
      ) : (
        <p className="text-gray-800 mt-1">Seller Phone: Not provided</p>
      )}

      <p className="text-2xl font-semibold text-green-600 mt-4">
        ₦{Number(product.price).toLocaleString()}
      </p>

      <p className="text-gray-700 mt-4 whitespace-pre-line">
        {product.description || "No description available."}
      </p>

      <ProductChatSection product={product} currentUser={currentUser} />
    </div>
  );
}
