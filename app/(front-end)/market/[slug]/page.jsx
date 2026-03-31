import Breadcrumb from "@/components/frontend/Breadcrumb";
import CategoryList from "@/components/frontend/CategoryList";
import { getData } from "@/lib/getData";
import Image from "next/image";
import React from "react";

export default async function page({ params: { slug } }) {
  const marketRes = await getData(`markets/details/${slug}`);

  if (!marketRes?.success) {
    console.log("MARKET ERROR:", marketRes.message);
    return <div>Error loading market</div>;
  }

  const market = marketRes.data;
  const marketCategoryIds = market.categoryIds || [];

  const categoriesRes = await getData("categories");

  if (!categoriesRes?.success) {
    console.log("CATEGORIES ERROR:", categoriesRes.message);
    return <div>Error loading categories</div>;
  }

  const categoriesData = categoriesRes.data;

  // ✅ DO NOT filter by category.products here (products come from API in CategoryList)
  const marketCategories = categoriesData.filter((category) =>
    marketCategoryIds.includes(category.id)
  );

  return (
    <>
      <Breadcrumb />

      <div className="bg-white border border-gray-300 rounded-lg p-4 flex items-center gap-6">
        <Image
          src={market.logoUrl}
          width={50}
          height={50}
          alt={market.title}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="py-4 text-base lg:text-4xl">{market.title}</h2>
          <p className="text-sm line-clamp-2 mb-4">{market.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 py-8 w-full">
        <div className="col-span-full sm:col-span-12 rounded-md">
          {marketCategories.map((category) => (
            <div className="space-y-8" key={category.id}>
              <CategoryList
                isMarketPage={false}
                category={category}
                categoryId={category.id}   // ✅ this is correct
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
