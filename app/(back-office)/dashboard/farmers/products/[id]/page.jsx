import FormHeader from "@/components/backoffice/FormHeader";
import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { getData } from "@/lib/getData";

export default async function UpdateProduct({ params: { id } }) {
  const productRes = await getData(`farmers/products/${id}`);
  const categoriesRes = await getData("categories");

  const product = productRes?.data || productRes;
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
        farmerId={product?.farmerId}
        categories={categories}
        existingProduct={product}
      />
    </div>
  );
}