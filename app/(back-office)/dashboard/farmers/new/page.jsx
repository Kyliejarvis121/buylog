"use client";

import React from "react";
import FormHeader from "@/components/backoffice/FormHeader";
import NewProductForm from "@/components/backoffice/NewProductForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function FarmerNewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Only allow FARMER role
  if (session.user.role !== "FARMER") {
    redirect("/dashboard"); // non-farmers go to dashboard
  }

  const farmerId = session.user.id;

  // Fetch categories for the form
  const categoriesRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/categories`);
  const categoriesData = await categoriesRes.json();
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data.map((c) => ({ id: c.id, title: c.title }))
    : [];

  return (
    <div>
      <FormHeader title="Upload New Product" />
      <NewProductForm categories={categories} farmers={[{ id: farmerId, title: session.user.name }]} />
    </div>
  );
}
