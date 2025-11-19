import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewProduct() {
  // Fetch categories and users safely
  const categoriesRes = await getData("categories");
  const usersRes = await getData("users");

  const categoriesData = categoriesRes?.data ?? [];
  const usersData = usersRes?.data ?? [];

  if (!categoriesData.length || !usersData.length) {
    return <div>Loading...</div>;
  }

  const farmersData = usersData.filter((user) => user.role === "FARMER");
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
