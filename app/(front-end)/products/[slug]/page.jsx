export const dynamic = "force-dynamic"; 
export const revalidate = 0;

import { getData } from "@/lib/getData";

export default async function ProductDetailPage({ params: { slug } }) {
  // Fetch product
  const productRes = await getData(`products/product/${slug}`);
  const product = productRes?.success ? productRes.data : null;

  // Fetch category only if product exists
  let category = null;
  if (product?.categoryId) {
    const categoryRes = await getData(`categories/${product.categoryId}`);
    category = categoryRes?.success ? categoryRes.data : null;
  }

  if (!product) {
    return (
      <div className="p-4 text-red-600">
        Product not found
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* -------------------------------
          PUT YOUR FULL PRODUCT DETAIL UI HERE
         ------------------------------- */}
      <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
      <p>{product.description}</p>

      {category && (
        <p className="text-sm mt-2 text-gray-600">
          Category: {category.name}
        </p>
      )}
    </div>
  );
}
