import dynamic from "next/dynamic";
import { getData } from "@/lib/getData";

// ✅ Dynamically import Swiper component, client-side only
const ProductImagesSwiper = dynamic(
  () => import("@/components/frontend/ProductImagesSwiper"),
  { ssr: false }
);

export default async function ProductDetailPage({ params: { slug } }) {
  // Fetch product
  const productRes = await getData(`products/product/${slug}`);
  const product = productRes?.success ? productRes.data : null;

  if (!product) {
    return <div className="p-4 text-red-600">❌ Product not found</div>;
  }

  // Fetch category
  let category = null;
  if (product?.categoryId) {
    const catRes = await getData(`categories/${product.categoryId}`);
    category = catRes?.success ? catRes.data : null;
  }

  // Prepare images array
  const images =
    product.productImages?.length > 0
      ? product.productImages
      : product.imageUrl
      ? [product.imageUrl]
      : ["/no-image.png"];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProductImagesSwiper images={images} title={product.title} />

      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      <p className="text-gray-600 mb-3">
        Category:{" "}
        <span className="font-semibold">
          {category?.name ?? "Uncategorized"}
        </span>
      </p>

      <p className="text-2xl font-semibold text-green-600 mb-5">
        ₦{Number(product.price).toLocaleString() ?? "0"}
      </p>

      <div className="text-gray-700 leading-7 whitespace-pre-line">
        {product.description || "No description available."}
      </div>
    </div>
  );
}
