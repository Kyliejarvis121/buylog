import { notFound } from "next/navigation";
import FormHeader from "@/components/backoffice/FormHeader";
import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { getData } from "@/lib/getData";

export default async function UpdateProduct({ params: { id } }) {
  const productRes = await getData(`farmers/products/${id}`);
  const categoriesRes = await getData("categories");

  // Map product data to shape ProductUpload expects
  const product = productRes?.data
    ? {
        id: productRes.data._id || productRes.data.id,
        title: productRes.data.title,
        description: productRes.data.description,
        price: productRes.data.price,
        salePrice: productRes.data.salePrice,
        productStock: productRes.data.productStock,
        productImages: productRes.data.productImages,
        imageUrl: productRes.data.imageUrl,
        categoryId: productRes.data.categoryId,
        farmerId: productRes.data.farmerId,
        isActive: productRes.data.isActive,
        isWholesale: productRes.data.isWholesale,
        wholesalePrice: productRes.data.wholesalePrice,
        wholesaleQty: productRes.data.wholesaleQty,
        tags: productRes.data.tags,
        phoneNumber: productRes.data.phoneNumber,
        location: productRes.data.location,
      }
    : null;

  if (!product) {
    return notFound();
  }

  const categoriesArray = categoriesRes?.data || categoriesRes || [];

  const categories = Array.isArray(categoriesArray)
    ? categoriesArray.map((cat) => ({
        id: cat.id,
        title: cat.title,
      }))
    : [];

  return (
    <div>
      <FormHeader title="Update Product" />

      <ProductUpload
        farmerId={product.farmerId}
        categories={categories}
        existingProduct={product}
      />
    </div>
  );
}