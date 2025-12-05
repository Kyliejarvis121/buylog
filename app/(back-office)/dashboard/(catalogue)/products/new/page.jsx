import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewProduct() {
  // Fetch categories
  const categoriesRes = await getData("categories");
  const categories = categoriesRes.success ? categoriesRes.data : [];

  // Fetch users
  const usersRes = await getData("users");
  const users = usersRes.success ? usersRes.data : [];

  // Loading fallback
  if (!categories.length || !users.length) {
    return <div>Loading...</div>;
  }

  // Extract farmers
  const farmers = users
    .filter((user) => user.role === "FARMER")
    .map((farmer) => ({
      id: farmer.id,
      title: farmer.name,
    }));

  // Format categories for dropdown
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
