import FormHeader from "@/components/backoffice/FormHeader";
import NewCategoryForm from "@/components/backoffice/Forms/NewCategoryForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function UpdateCategory({ params: { id } }) {
  const { success, data: category, error } = await getData(`categories/${id}`);

  if (!success || !category) {
    return (
      <div className="p-4 text-red-600">
        Failed to load category: {error}
      </div>
    );
  }

  return (
    <div>
      <FormHeader title="Update Category" />
      <NewCategoryForm updateData={category} />
    </div>
  );
}
