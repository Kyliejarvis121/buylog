import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateProduct({ params: { id } }) {
  const { success: productSuccess, data: product, error: productError } = await getData(`products/${id}`);
  const { success: categoriesSuccess, data: categoriesData } = await getData("categories");
  const { success: usersSuccess, data: usersData } = await getData("users");

  if (!productSuccess || !product) {
    return <div className="p-4 text-red-600">Failed to load product: {productError}</div>;
  }

  const farmers = (usersData || []).filter(u => u.role === "FARMER").map(f => ({ id: f.id, title: f.name }));
  const categories = (categoriesData || []).map(c => ({ id: c.id, title: c.title }));

  return (
    <div>
      <FormHeader title="Update Product" />
      <NewProductForm updateData={product} categories={categories} farmers={farmers} />
    </div>
  );
}
