export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import nextDynamic from "next/dynamic";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateLastSeen } from "@/lib/updateLastSeen";

const ProductImageCarousel = nextDynamic(
  () => import("@/components/frontend/ProductImageCarousel"),
  { ssr: false }
);

const ProductChatSection = nextDynamic(
  () => import("@/components/frontend/chat/ProductChatSection"),
  { ssr: false }
);

// Helper: fetch with timeout
async function fetchWithTimeout(key, ms = 10000) {
  console.log("[getData] Fetching:", key);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);

  try {
    const res = await getData(key, { signal: controller.signal });
    console.log("[getData] Response for", key, res);
    return res;
  } catch (err) {
    console.error("[getData] Error fetching", key, err);
    return { success: false, error: err.message || "Unknown error" };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = params;

  // Fetch product safely
  const productRes = await fetchWithTimeout(`products/product/${slug}`);
  const product = productRes?.success ? productRes.data : null;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-red-600">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2">
          The product you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  const session = await getServerSession(authOptions);
  const currentUser = session?.user;

  if (currentUser?.id) {
    await updateLastSeen(currentUser.id);
  }

  const isOwner = currentUser?.id === product?.userId;
  const seller = product?.farmer;

  const isOnline =
    seller?.lastSeen &&
    new Date() - new Date(seller.lastSeen) < 5 * 60 * 1000;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Product Images */}
      <ProductImageCarousel
        productImages={product.productImages ?? []}
        thumbnail={product.imageUrl ?? null}
      />

      <h1 className="text-3xl font-bold mt-6">{product.title}</h1>
      <p className="text-gray-600 mt-2">
        Category: {product.category?.title || "Uncategorized"}
      </p>

      {/* Location */}
      {product.city || product.state || product.country ? (
        <p className="text-gray-600 mt-1">
          📍 Location:{" "}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${product.city || ""} ${product.state || ""} ${product.country || ""}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline"
          >
            {[product.city, product.state, product.country].filter(Boolean).join(", ")}
          </a>
        </p>
      ) : (
        <p className="text-gray-400 mt-1">📍 Location: Not provided</p>
      )}

      {/* Phone */}
      {product.phoneNumber && (
        <p className="text-blue-600 mt-1">
          Seller Phone:{" "}
          <a href={`tel:${product.phoneNumber}`} className="underline">
            {product.phoneNumber}
          </a>
        </p>
      )}

      {/* Price */}
      <p className="text-2xl font-semibold text-green-600 mt-4">
        ₦{Number(product.price).toLocaleString()}
      </p>

      {/* Description */}
      <p className="text-gray-700 mt-4 whitespace-pre-line">
        {product.description || "No description available."}
      </p>

      {/* CTA for guests */}
      {!currentUser && (
        <div className="mt-6 border rounded-xl p-6 bg-gray-50 text-center shadow-sm">
          <h3 className="text-lg font-semibold mb-2">
            💬 Want to message this seller?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Create a free account to chat directly with the seller.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/login"
              className="px-4 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium"
            >
              Login
            </a>
            <a
              href="/register"
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Sign Up
            </a>
          </div>
        </div>
      )}

      {/* Seller Info */}
      {seller && !isOwner && (
        <div className="mt-8 border rounded-xl p-5 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold">{seller.name}</h3>
              <p className="text-sm mt-1">
                {isOnline ? (
                  <span className="text-green-600 font-medium">Online now</span>
                ) : (
                  <span className="text-gray-500">
                    Last seen{" "}
                    {seller.lastSeen
                      ? new Date(seller.lastSeen).toLocaleString()
                      : "Recently"}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Section */}
      {currentUser && !isOwner && seller && (
        <div className="mt-6">
          <ProductChatSection
            productId={product.id}
            farmerId={product.farmerId}
            currentUserId={currentUser.id}
          />
        </div>
      )}

      {/* Safety Tip */}
      <div className="mt-8 p-4 bg-[#fff7f5] border-l-4 border-[#f97316] rounded">
        <strong>Safety Tip:</strong>
        <p className="text-sm text-gray-700 mt-2">
          BuyLog does not handle payments or financial transactions.
          Buyers and sellers should agree on a safe meeting location.
          Always meet in public places and confirm payments before leaving.
          BuyLog is not responsible for any loss.
        </p>
      </div>
    </div>
  );
}