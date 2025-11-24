export const dynamic = "force-dynamic";
export const revalidate = 0;

import CategoryList from "@/components/frontend/CategoryList";
import CommunityTrainings from "@/components/frontend/CommunityTrainings";
import Hero from "@/components/frontend/Hero";
import MarketList from "@/components/frontend/MarketList";
import { getData } from "@/lib/getData";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {
  // Auth session (optional)
  const session = await getServerSession(authOptions);

  // Fetch categories
  const categoriesRes = await getData("categories");
  const categoriesArray = Array.isArray(categoriesRes?.data)
    ? categoriesRes.data
    : Array.isArray(categoriesRes)
    ? categoriesRes
    : [];

  // Optionally fetch related products count per category
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

  // Filter categories safely
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
      <Hero />
      <MarketList />

      {filteredCategories.map((category, i) => (
        <div className="py-8" key={i}>
          <CategoryList isMarketPage={false} category={category} />
        </div>
      ))}

      <CommunityTrainings
        title="Featured Trainings"
        trainings={trainings.slice(0, 3)}
      />
    </div>
  );
}
