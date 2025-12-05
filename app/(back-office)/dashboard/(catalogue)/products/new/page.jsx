import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";

export default async function NewProduct() {
  // Fetch categories
  const catRes = await getData("categories");
  const categories = catRes.success ? catRes.data : [];

  // Fetch users (farmers)
  const userRes = await getData("users");
  const users = userRes.success ? userRes.data : [];

  // Loading state
  if (!categories.length || !users.length) {
    return <div>Loading...</div>;
  }

  const farmers = users
    .filter((user) => user.role === "FARMER")
    .map((farmer) => ({
      id: farmer.id,
      title: farmer.name,
    }));

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    title: category.title,
  }));

  return (
    <div>
      <FormHeader title="New Product" />
      <NewProductForm categories={categoryOptions} farmers={farmers} />
    </div>
  );
}
