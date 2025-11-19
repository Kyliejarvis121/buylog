export const dynamic = "force-dynamic";
// Optional: you can also add revalidate=0
export const revalidate = 0;


import NewMarketForm from "@/components/backoffice/NewMarketForm";
import { getData } from "@/lib/getData";
import React from "react";

export default async function NewMarket() {
  const categoriesData = await getData("categories");
  const categories = categoriesData.map((category) => {
    return {
      id: category.id,
      title: category.title,
    };
  });
  return <NewMarketForm categories={categories} />;
}
