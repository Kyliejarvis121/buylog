import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";

export default async function UpdateProduct({ params: { id } }) {
  const product = await getData(`products/${id}`);
  const categoriesData = await getData("categories");
  const categories = categoriesData.map((cat) => ({
    id: cat.id,
    title: cat.title,
  }));

  return (
    <div>
      <FormHeader title="Update Product" />
      <NewProductForm updateData={product} categories={categories} />
    </div>
  );
}
