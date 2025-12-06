export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getData } from "@/lib/getData";

export default async function ProductDetailPage({ params }) {
  const slug = params.slug;

  // Fetch product details
  const productRes = await getData(`products/product/${slug}`);
  const product = productRes?.success ? productRes.data : null;

  // Fetch category only if product exists
  let category = null;
  if (product?.categoryId) {
    const categoryRes = await getData(`categories/${product.categoryId}`);
    category = categoryRes?.success ? categoryRes.data : null;
  }

  // If product not found
  if (!product) {
    return (
      <div className="p-4 text-red-600 text-center text-lg">
        Product not found
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Product Title */}
      <h1 className="text-2xl font-bold mb-3">{product.title}</h1>

      {/* Image */}
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full max-w-md rounded-lg shadow mb-4"
        />
      )}

      {/* Category */}
      {category && (
        <p className="text-sm text-gray-600 mb-2">
          Category: <span className="font-medium">{category.name}</span>
        </p>
      )}

      {/* Price */}
      <p className="text-xl font-semibold text-green-700 mb-2">
        ₦{product.salePrice}
      </p>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed">{product.description}</p>
    </div>
  );
}
