// app/(back-office)/dashboard/markets/new/page.jsx

import NewMarketForm from "@/components/backoffice/NewMarketForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewMarket() {
  // Fetch categories using your existing getData helper
  const { success, data, error } = await getData("categories");

  // Ensure categories fallback if API throws error
  const categories = success
    ? data.map((category) => ({
        id: category.id,
        title: category.title,
      }))
    : [];

  return <NewMarketForm categories={categories} />;
}
