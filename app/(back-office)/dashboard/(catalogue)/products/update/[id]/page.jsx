import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateProduct({ params: { id } }) {
  // Fetch the product
  const productRes = await getData(`products/${id}`);
  const product = productRes.success ? productRes.data : null;

  if (!product) {
    return <div className="p-4 text-red-600">Product not found</div>;
  }

  // Fetch categories
  const categoriesRes = await getData("categories");
  const categoriesData = categoriesRes.success ? categoriesRes.data : [];

  // Fetch users
  const usersRes = await getData("users");
  const usersData = usersRes.success ? usersRes.data : [];

  // Filter farmers
  const farmersData = usersData.filter((user) => user.role === "FARMER");
  const farmers = farmersData.map((farmer) => ({
    id: farmer.id,
    title: farmer.name,
  }));

  // Map categories
  const categories = categoriesData.map((category) => ({
    id: category.id,
    title: category.title,
  }));

  return (
    <div>
      <FormHeader title="Update Product" />
      <NewProductForm
        updateData={product}
        categories={categories}
        farmers={farmers}
      />
    </div>
  );
}
