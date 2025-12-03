// app/(front-end)/page.jsx
"use client";

import HeroCarousel from "@/components/frontend/HeroCarousel";
import MarketList from "@/components/frontend/MarketList";
import CategoryList from "@/components/frontend/CategoryList";
import CommunityTrainings from "@/components/frontend/CommunityTrainings";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {
  // Optional auth session
  const session = await getServerSession(authOptions);

  // Fetch banners
  const bannersRes = await getData("banners");
  const banners = Array.isArray(bannersRes?.data)
    ? bannersRes.data
    : Array.isArray(bannersRes)
    ? bannersRes
    : [];

  // Fetch markets
  const marketsRes = await getData("markets");
  const markets = Array.isArray(marketsRes?.data)
    ? marketsRes.data
    : Array.isArray(marketsRes)
    ? marketsRes
    : [];

  // Fetch categories
  const categoriesRes = await getData("categories");
  const categoriesArray = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : Array.isArray(categoriesRes)
    ? categoriesRes
    : [];

  // Fetch products for each category
  const categories = await Promise.all(
    categoriesArray.map(async (cat) => {
      const productsRes = await getData(`products?catId=${cat.id}`);
      const products = Array.isArray(productsRes?.data)
        ? productsRes.data
        : Array.isArray(productsRes)
        ? productsRes
        : [];
      return { ...cat, products };
    })
  );

  // Only categories with >3 products
  const filteredCategories = categories.filter((c) => c.products.length > 3);

  // Fetch trainings
  const trainingsRes = await getData("trainings");
  const trainings = Array.isArray(trainingsRes?.data)
    ? trainingsRes.data
    : Array.isArray(trainingsRes)
    ? trainingsRes
    : [];

  return (
    <div className="min-h-screen">
      {/* HERO / BANNER CAROUSEL */}
      <HeroCarousel banners={banners} />

      {/* MARKETS */}
      <MarketList markets={markets} />

      {/* CATEGORIES */}
      {filteredCategories.map((category, i) => (
        <div className="py-8" key={i}>
          <CategoryList isMarketPage={false} category={category} />
        </div>
      ))}

      {/* FEATURED TRAININGS */}
      <CommunityTrainings
        title="Featured Trainings"
        trainings={trainings.slice(0, 3)}
      />
    </div>
  );
}
