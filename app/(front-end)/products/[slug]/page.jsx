export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getData } from "@/lib/getData";

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
  // 3. Render
  // -------------------------------
  if (!product) {
    return (
      <div className="p-4 text-center text-red-600 text-lg">
        ❌ Product not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* PRODUCT IMAGE */}
      <div className="w-full mb-6">
        <img
          src={product.imageUrl || product.image || "/no-image.png"}
          alt={product.title}
          className="w-full h-80 object-cover rounded-lg border bg-gray-100"
        />
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
