import { notFound } from "next/navigation";
import FormHeader from "@/components/backoffice/FormHeader";
import ProductUpload from "@/components/backoffice/Farmer/ProductUpload";
import { getData } from "@/lib/getData";

export default async function EditFarmerProduct({ params }) {
  const { id } = params;

  const [productRes, categoriesRes] = await Promise.all([
    getData(`farmers/products/${id}`),
    getData("categories"),
  ]);

  const product = productRes?.data; // 👈 important
  const categoriesArray = categoriesRes?.data || [];

  if (!product) return notFound();

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