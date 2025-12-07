// app/(back-office)/dashboard/farmers/products/new/page.jsx
"use client";

import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import React from "react";

export default async function NewProductPage() {
  // Get the session
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "FARMER") {
    return <div>You must be logged in as a farmer to upload products.</div>;
  }

  // Fetch categories (always needed)
  const categoriesData = (await getData("categories")) || [];
  const categories = categoriesData.map((category) => ({
    id: category.id,
    title: category.title,
  }));

  // We don’t need farmers array because the logged-in farmer uploads
  const farmerId = session.user.id;

  return (
    <div>
      <FormHeader title="Add New Product" />
      <NewProductForm categories={categories} farmerId={farmerId} />
    </div>
  );
}
