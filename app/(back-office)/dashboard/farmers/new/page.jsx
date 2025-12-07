// app/(back-office)/dashboard/farmers/new/page.jsx
"use client";

import FormHeader from "@/components/backoffice/FormHeader";
import NewFarmerForm from "@/components/backoffice/NewFarmerForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewFarmerPage() {
  // Fetch categories safely
  const categoriesData = (await getData("categories")) || [];
  const categories = Array.isArray(categoriesData)
    ? categoriesData.map((category) => ({
        id: category.id,
        title: category.title,
      }))
    : [];

  // Fetch users safely
  const usersData = (await getData("users")) || [];
  const farmersData = Array.isArray(usersData)
    ? usersData.filter((user) => user.role === "FARMER")
    : [];
  const farmers = farmersData.map((farmer) => ({
    id: farmer.id,
    title: farmer.name,
  }));

  return (
    <div>
      <FormHeader title="New Farmer" />
      <NewFarmerForm categories={categories} farmers={farmers} />
    </div>
  );
}
