"use client";

import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewProductPage() {
  // Fetch categories
  const categoriesData = await getData("categories") || [];
  const categories = categoriesData.map((category) => ({
    id: category.id,
    title: category.title,
  }));

  // Get logged-in farmer's ID
  const usersData = await getData("users") || [];
  const farmersData = usersData.filter((user) => user.role === "FARMER") || [];
  const farmers = farmersData.map((farmer) => ({
    id: farmer.id,
    title: farmer.name,
  }));

  return (
    <div className="p-4">
      <FormHeader title="Upload New Product" />
      <NewProductForm categories={categories} farmers={farmers} />
    </div>
  );
}

