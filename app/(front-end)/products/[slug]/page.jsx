import dynamic from "next/dynamic";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateLastSeen } from "@/lib/updateLastSeen";
import Link from "next/link";

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

  if (!product) {
    return <div className="text-red-600 p-4">Product not found</div>;
  }

  const session = await getServerSession(authOptions);
  const currentUser = session?.user;

  if (currentUser?.id) {
    await updateLastSeen(currentUser.id);
  }

  const isOwner = currentUser?.id === product?.userId;
  const seller = product?.farmer;

  // ONLINE CHECK (5 mins threshold)
  const isOnline =
    seller?.lastSeen &&
    new Date() - new Date(seller.lastSeen) < 5 * 60 * 1000;

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

      {/* LOCATION */}
      {product.location ? (
        <p className="text-gray-600 mt-1">
          📍 Location:{" "}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              product.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-blue-600 underline"
          >
            {product.location}
          </a>
        </p>
      ) : (
        <p className="text-gray-400 mt-1">📍 Location: Not provided</p>
      )}

      {/* PHONE */}
      {product.phoneNumber && (
        <p className="text-blue-600 mt-1">
          Seller Phone:{" "}
          <a href={`tel:${product.phoneNumber}`} className="underline">
            {product.phoneNumber}
          </a>
        </p>
      )}

      <p className="text-2xl font-semibold text-green-600 mt-4">
        ₦{Number(product.price).toLocaleString()}
      </p>

      <p className="text-gray-700 mt-4 whitespace-pre-line">
        {product.description || "No description available."}
      </p>

      {/* ================= SELLER CARD ================= */}
      {seller && !isOwner && (
        <div className="mt-8 border rounded-xl p-5 bg-white dark:bg-slate-800 shadow-sm">

          {/* Seller Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {seller.name}
              </h3>

              {/* Online Status */}
              <p className="text-sm mt-1">
                {isOnline ? (
                  <span className="text-green-600 font-medium">
                    ● Online now
                  </span>
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

            {/* View Profile */}
            <Link
              href={`/seller/${seller.id}`}
              className="text-sm text-blue-600 underline"
            >
              View Profile
            </Link>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-5 space-y-3">

            {/* CONTACT SELLER CHAT */}
            <ProductChatSection
              productId={product.id}
              farmerId={product.farmerId}
              currentUserId={currentUser?.id ?? null}
            />

            {/* WHATSAPP BUTTON */}
            {seller.phoneNumber && (
              <a
                href={`https://wa.me/${seller.phoneNumber.replace(
                  /^0/,
                  "234"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      )}

      {/* ================= SAFETY TIP ================= */}
      <div className="mt-8 p-4 bg-[#fff7f5] border-l-4 border-[#f97316] rounded">
        <strong>Safety Tip:</strong>
        <p className="text-sm text-gray-700 mt-2">
          BuyLog does not handle payments or financial transactions. Buyers and sellers
          should agree on a safe meeting location. Meet in public places and confirm
          payments before leaving.
        </p>
      </div>
    </div>
  );
}