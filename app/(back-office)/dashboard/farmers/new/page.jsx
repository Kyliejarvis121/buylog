"use client";

import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewFarmerProduct() {
  const categoriesData = await getData("categories");
  const categories = categoriesData.map((cat) => ({
    id: cat.id,
    title: cat.title,
  }));

  return (
    <div>
      <FormHeader title="Upload New Product" />
      <NewProductForm categories={categories} />
    </div>
  );
}
