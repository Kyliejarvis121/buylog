import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";

export default async function NewProductPage() {
  const categoriesData = await getData("categories");
  const categories = categoriesData.map((cat) => ({
    id: cat.id,
    title: cat.title,
  }));

  return (
    <div>
      <FormHeader title="Add New Product" />
      <NewProductForm categories={categories} />
    </div>
  );
}
