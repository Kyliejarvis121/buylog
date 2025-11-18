export const dynamic = "force-dynamic"; // prevent static generation

import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewProduct() {
  // Fetch categories and users
  const categoriesData = (await getData("categories")) ?? [];
  const usersData = (await getData("users")) ?? [];

  // Filter farmers
  const farmersData = usersData.filter((user) => user.role === "FARMER") ?? [];

  // Map lists safely
  const farmers = farmersData.map((farmer) => ({
    id: farmer.id,
    title: farmer.name,
  }));

  const categories = categoriesData.map((category) => ({
    id: category.id,
    title: category.title,
  }));

  return (
    <div>
      <FormHeader title="New Product" />
      <NewProductForm categories={categories} farmers={farmers} />
    </div>
  );
}
